import React, { Component } from 'react';
import './css/App.css';
import MyCard from './ui/myCard/MyCard';
import Results from './components/Results/Results';
import {
    loadModels,
    getFullFaceDescription,
    isFaceDetectionModelLoaded,
    getSimilary,
} from './api/face';

// Initial State
const INIT_STATE = {
    imageURL: '',
    WIDTH: null,
    HEIGHT: 0,
    fullDesc: null,
    detections: null,
    descriptors: null,
    match: null,
    loading: false,
    complete: false,
};

const MaxWidth = 450;
const boxColor = '#BE80B5';

class App extends Component {
    state = {
        cards: [
            {
                ...INIT_STATE,
                title: 'Photo 1',
            },
            {
                ...INIT_STATE,
                title: 'Photo 2',
            },
        ],
    };

    componentWillMount = async () => {
        let _W = document.documentElement.clientWidth;
        if (_W > MaxWidth) _W = MaxWidth;
        let cards = [...this.state.cards];
        cards.map((card, i) => {
            return (cards[i].WIDTH = _W);
        });
        this.setState({ cards });
        await loadModels();
        await this.setState({
            isModelLoaded: !!isFaceDetectionModelLoaded(),
        });
    };

    handleImage = async (image, intCard) => {
        let cards = [...this.state.cards];
        cards[intCard].loading = false;
        cards[intCard].complete = true;
        await getFullFaceDescription(image).then(fullDesc => {
            if (!!fullDesc) {
                cards[intCard].fullDesc = fullDesc;
                cards[intCard].detections = fullDesc.map(fd => fd.detection);
                this.setState({
                    cards,
                });
            }
        });
    };

    handleFileChange = async (event, countCard) => {
        const that = this;
        try {
            if (!!event.target.files) {
                const img = document.createElement('img');
                const blob = URL.createObjectURL(event.target.files[0]);
                img.src = blob;
                img.onload = async function() {
                    let cards = [...that.state.cards];
                    let HEIGHT =
                        (cards[countCard].WIDTH * img.height) / img.width;
                    cards[countCard].HEIGHT = HEIGHT;
                    cards[countCard].imageDimension = {
                        width: img.width,
                        height: img.height,
                    };
                    cards[countCard].imageURL = !!blob ? blob : '';
                    cards[countCard].loading = true;
                    cards[countCard].complete = false;
                    await that.setState({
                        cards,
                    });
                    await that.handleImage(
                        that.state.cards[countCard].imageURL,
                        countCard
                    );
                };
            }
        } catch (e) {
            console.log(e);
        }
    };

    handleDeleteFile = intCard => {
        let cards = [...this.state.cards];
        let _W = document.documentElement.clientWidth;
        if (_W > MaxWidth) _W = MaxWidth;
        cards[intCard] = {
            ...INIT_STATE,
            title: 'Photo ' + (intCard + 1),
            loading: false,
        };
        cards[intCard].WIDTH = _W;
        this.setState({
            cards,
        });
    };

    showCards = () =>
        this.state.cards.map((card, i) => (
            <MyCard
                key={i}
                title={card.title}
                photo={card.imageURL}
                width={card.WIDTH}
                upload={e => {
                    this.handleFileChange(e, i);
                }}
                delete={() => {
                    this.handleDeleteFile(i);
                }}
                fullDesc={card.fullDesc}
                boxColor={boxColor}
                detections={card.detections}
                {...card}
                style={{
                    display: 'flex',
                }}
            />
        ));

    isShowResult = () => {
        let completedCards = 0;
        this.state.cards.map((card, i) => {
            if (card.complete && card.detections.length > 0) {
                completedCards++;
            }
            return null;
        });
        if (completedCards >= this.state.cards.length) {
            this.getResultSimilary();
            return true;
        } else {
            return false;
        }
    };

    getResultSimilary = () => {
        return getSimilary(this.state.cards[0], this.state.cards[1]);
    };

    render() {
        return (
            <React.Fragment>
                <div className='container'>
                    {this.state.cards ? this.showCards() : null}
                </div>
                {this.isShowResult() ? (
                    <div className='container'>
                        <Results result={this.getResultSimilary()} />
                    </div>
                ) : null}
            </React.Fragment>
        );
    }
}

export default App;

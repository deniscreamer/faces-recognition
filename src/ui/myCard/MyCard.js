import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import DrawBox from '../DrawBox/DrawBox';
import LinearProgress from '@material-ui/core/LinearProgress';

const styles = {
    card: {
        maxWidth: '600px',
    },
    media: {
        height: 250,
    },
};

class MyCard extends Component {
    showButtons = () => {
        return (
            <CardActions style={{ float: 'right' }}>
                <Button
                    size='small'
                    color='primary'
                    onClick={this.props.delete}>
                    Удалить
                </Button>
            </CardActions>
        );
    };

    render() {
        const { detections, width } = this.props;
        let drawBox = null;
        if (!!detections) {
            drawBox = detections.map((detection, i) => {
                const relativeBox = detection.relativeBox;
                const dimension = detection._imageDims;
                let _X = width * relativeBox._x;
                let _Y =
                    (relativeBox._y * width * dimension._height) /
                    dimension._width;
                let _W = width * relativeBox.width;
                let _H =
                    (relativeBox.height * width * dimension._height) /
                    dimension._width;
                return (
                    <div key={i}>
                        <div
                            style={{
                                position: 'absolute',
                                border: 'solid',
                                borderColor: 'blue',
                                height: _H,
                                width: _W,
                                top: 0,
                                left: 0,
                                transform: `translate(${_X}px,${_Y}px)`,
                            }}
                        />
                    </div>
                );
            });
        }

        const id = 'myFileUpload' + this.props.title;
        return (
            <div
                style={{
                    padding: '8px',
                }}>
                <Card
                    style={{
                        width: this.props.width,
                        height: 'auto',
                    }}>
                    <input
                        style={{ display: 'none' }}
                        id={id}
                        type='file'
                        accept='image/*'
                        onChange={this.props.upload}
                    />
                    <CardActionArea>
                        <label htmlFor={id}>
                            <CardMedia
                                component='img'
                                src={
                                    this.props.photo
                                        ? this.props.photo
                                        : '/static/images/upload3.png'
                                }
                                style={{
                                    cursor: 'pointer',
                                }}
                            />
                            {!!this.props.fullDesc ? (
                                <DrawBox
                                    fullDesc={this.props.fullDesc}
                                    imageWidth={this.props.width}
                                    boxColor={this.props.boxColor}
                                />
                            ) : null}
                            {!!this.props.fullDesc ? drawBox : null}
                            <CardContent>
                                {this.props.loading ? (
                                    <LinearProgress />
                                ) : (
                                    <Typography
                                        gutterBottom
                                        variant='h5'
                                        component='h2'>
                                        {this.props.complete ? (
                                            this.props.detections <= 0 ? (
                                                <span>Лиц не обнаружено</span>
                                            ) : (
                                                <span>
                                                    Обнаружено лиц -{' '}
                                                    {
                                                        this.props.detections
                                                            .length
                                                    }
                                                </span>
                                            )
                                        ) : null}
                                    </Typography>
                                )}
                                <Typography component='p'>
                                    {this.props.loading ? (
                                        <span>Определяю лица...</span>
                                    ) : !this.props.complete ? (
                                        <span>
                                            Пожалуйста, загрузите свою
                                            фотографию, на которой хорошо видно
                                            лицо
                                        </span>
                                    ) : null}
                                </Typography>
                            </CardContent>
                        </label>
                    </CardActionArea>
                    {this.props.photo ? this.showButtons() : null}
                </Card>
            </div>
        );
    }
}

export default withStyles(styles)(MyCard);

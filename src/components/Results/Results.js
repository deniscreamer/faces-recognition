import React from 'react';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';

const checkCoinside = results => {
    let resultCheck = false;
    if (!!results) {
        for (let res of results) {
            if (res.result <= 0.6) {
                resultCheck = true;
            }
        }
    }
    return resultCheck;
};

const showCoinside = results =>
    !!results
        ? results.map((res, i) => (
              <Typography component='p' key={i}>
                  <span>
                      <strong>Лицо {res.faceOne + 1}</strong> [left] и{' '}
                      <strong>Лицо {res.faceTwo + 1}</strong> [right] -{' '}
                      {res.result <= 0.6 ? 'похожи' : 'не похожи'} (
                      {Math.abs(res.result * 100 - 100)}%)
                  </span>
              </Typography>
          ))
        : null;

const Results = props => {
    return (
        <div>
            <Card style={{ maxWidth: '700px', marginTop: '15px' }}>
                <CardActionArea>
                    <CardContent>
                        <Typography
                            gutterBottom
                            variant='h5'
                            component='h2'
                            style={{
                                color: props.result ? 'green' : 'red',
                            }}>
                            {checkCoinside(props.result)
                                ? 'Есть совпадения'
                                : 'Нет совпадений'}
                        </Typography>
                        {showCoinside(props.result)}
                    </CardContent>
                </CardActionArea>
            </Card>
        </div>
    );
};

export default Results;

import * as moment from 'moment';
import {Maybe} from 'ramda-fantasy';

const formatDate = (secondsFromEpoch) => moment(secondsFromEpoch).format('hh:mm DD MMMM YYYY');

function substituteLineBreaksIn(message) {
  let decoded = decodeURIComponent(message);
  decoded = decoded.replace(new RegExp('<br/>', 'g'), '\n');
  return decoded.replace(new RegExp('<br>', 'g'), '\n');
}

function transformHistory(histories) {
  return Maybe(histories).getOrElse([]).sort((a, b) => {
    if (a.timestamp < b.timestamp) return 1;
    if (a.timestamp > b.timestamp) return -1;
    return 0;
  })
  .map((history) => {
    history.message = substituteLineBreaksIn(history.message);
    history.timestamp = formatDate(history.timestamp);
    return history;
  });
}

export {transformHistory};


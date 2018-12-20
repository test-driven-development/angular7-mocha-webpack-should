import {transformHistory} from './transform-histories';
import {transformCupids} from './transform-cupids';
import * as moment from 'moment';
import {Maybe} from 'ramda-fantasy';
import * as R from 'ramda';
const {clone} = R;

const formatDate = (secondsFromEpoch) =>  moment(secondsFromEpoch).format('MM-DD-YY');

function applyDefaultWhenEmpty(defaultValue: any, value: any) {
  return Maybe(value)
    .map((v) => v === '' ? defaultValue : v)
    .getOrElse(defaultValue);
}

function transformDetails(detail: any): any {
  const newDetails = clone(detail);
  newDetails.assignTo = applyDefaultWhenEmpty('unassigned', detail.assignTo);
  newDetails.cupids = transformCupids(detail.userIds);
  newDetails.created = formatDate(detail.created);
  newDetails.history = transformHistory(detail.history);

  return newDetails;
}

export {transformDetails};

import * as R from 'ramda';
import {Maybe} from 'ramda-fantasy';
const {prop, reject, isNil, map, compose} = R;

const getCupidFrom = prop('cupid');
const filterOutEmpties = reject(isNil);

function transformCupids (cupids) {
  return filterOutEmpties(map(getCupidFrom)(Maybe(cupids).getOrElse([])));
}

export {transformCupids};


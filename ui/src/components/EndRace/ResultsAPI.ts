import axios from 'axios';
import { withErrorHandler } from '../../api/withErrorHandler';

export const RaceResults = {
  getRaceResults: withErrorHandler(async (): Promise<any> => {
    const res = await axios.get('http://www.randomnumberapi.com/api/v1.0/random?min=1&max=10&count=10');
    return res.data;
  }),
};

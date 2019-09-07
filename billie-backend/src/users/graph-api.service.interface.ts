import { User } from './user.type';

export const GRAPH_API_SERVICE = 'GRAPH_API_SERVICE';

export interface IGraphApiService {
  fetchUserData(userFbId: string): Promise<User>;
}

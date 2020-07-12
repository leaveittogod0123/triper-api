import {
  Injectable,
  HttpService,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ProxyService {
  kakaoRESTHostUrl: string;
  kakaoAPIKey: string;
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.kakaoRESTHostUrl = this.configService.get<string>(
      'KAKAO_REST_HOST_URL',
    );
    this.kakaoAPIKey = process.env.KAKAO_REST_KEY;
  }

  async get(url: string, headers?: any, params?: any): Promise<any> {
    console.log(`get [URL]: ${this.kakaoRESTHostUrl}${url}`);
    console.log('query:', params['query'], encodeURI(params['query']));

    const searchParams = Object.keys(params)
      .reduce((acc, cur, i) => {
        if (params[cur]) {
          acc += `${cur}=${encodeURI(params[cur])}&`;
        }
        return acc;
      }, '?')
      .slice(0, -1);
    try {
      const res = await this.httpService
        .get(`${this.kakaoRESTHostUrl}${url}${searchParams}`, {
          headers: {
            ...headers,
            Authorization: `KakaoAK ${this.kakaoAPIKey}`,
          },
        })
        .toPromise();
      console.log('res', res);
      const resData = res.data;
      return resData;
    } catch (err) {
      console.log('에러!!!', err);
      const errData = err.response?.data;
      console.log(JSON.stringify(errData));
      throw new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}

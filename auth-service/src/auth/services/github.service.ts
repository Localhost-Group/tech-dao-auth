import { HttpService, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { RequestBodyForAccessToken } from '../interfaces/requestBody';
@Injectable()
export class GithubService {
  private urlForAccessToken = `https://github.com/login/oauth/access_token`;

  private GIT_CLIENT_ID: string;
  private GIT_CLIENT_CODE: string;
  constructor(
    private configService: ConfigService,
    private httpService: HttpService,
  ) {
    this.GIT_CLIENT_ID = this.configService.get<string>('GIT_CLIENT_ID');
    this.GIT_CLIENT_CODE = this.configService.get<string>('GIT_CLIENT_SECRET');
  }
  public prepareRequestUrlForGithubOAuth() {
    return {
      url: `https://github.com/login/oauth/authorize?client_id=${this.GIT_CLIENT_ID}&scope=read:repo`,
    };
  }

  public handleRequestForAccesToken(code: string): Observable<string> {
    const requestBody = this.createRequestBodyForAccessToken(code);
    const optsForFetch = { headers: { accept: 'application/json' } };
    return this.httpService
      .post(this.urlForAccessToken, requestBody, optsForFetch)
      .pipe(map((result) => result.data.access_token));
  }

  private createRequestBodyForAccessToken(
    code: string,
  ): RequestBodyForAccessToken {
    return {
      client_secret: this.GIT_CLIENT_CODE,
      client_id: this.GIT_CLIENT_ID,
      code,
    };
  }
}

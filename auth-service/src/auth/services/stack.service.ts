import { HttpService, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { map } from 'rxjs/operators';

@Injectable()
export class StackService {
  private stackOAuthUrl: string;
  private stackAcessTokenUrl: string;
  private STACK_CLIENT_ID: string;
  private STACK_CLIENT_SECRET: string;

  constructor(
    private configService: ConfigService,
    private httpService: HttpService,
  ) {
    this.STACK_CLIENT_ID = this.configService.get<string>('STACK_CLIENT_ID');
    this.STACK_CLIENT_SECRET = this.configService.get<string>(
      'STACK_CLIENT_SECRET',
    );
    this.stackAcessTokenUrl = `https://stackoverflow.com/oauth/access_token/json?client_id=${this.STACK_CLIENT_ID}&client_secret=${this.STACK_CLIENT_SECRET}&redirect_uri=http://localhost:3000/auth/stack-callback`;
    this.stackOAuthUrl = `https://stackexchange.com/oauth?client_id=${this.STACK_CLIENT_ID}&scope=read_inbox&redirect_uri=http://localhost:3000/auth/stack-callback`;
  }
  public prepareUrlToRequestOAuthLogin() {
    return {
      url: this.stackOAuthUrl,
    };
  }

  public handleRequestForAccesToken(code: string): Promise<string> {
    const stringToAdd = `&code=${code}`;
    const urlToRequest = this.stackAcessTokenUrl.concat(stringToAdd);
    return this.httpService
      .post(urlToRequest, {
        headers: { 'content-type': 'application/x-www-form-urlencoded' },
      })
      .pipe(map((result) => result.data.access_token))
      .toPromise();
  }
}

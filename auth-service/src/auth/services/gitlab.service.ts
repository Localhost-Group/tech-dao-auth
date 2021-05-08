import { HttpService, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { map } from 'rxjs/operators';
@Injectable()
export class GitlabService {
  private GITLAB_CLIENT_ID: string;
  private GITLAB_CLIENT_CODE: string;
  constructor(
    private configService: ConfigService,
    private httpService: HttpService,
  ) {
    this.GITLAB_CLIENT_ID = this.configService.get<string>('GITLAB_CLIENT_ID');
    this.GITLAB_CLIENT_CODE = this.configService.get<string>(
      'GITLAB_CLIENT_SECRET',
    );
  }
  prepareUrlToRequestOAuthLogin() {
    return {
      url: `https://gitlab.com/oauth/authorize?client_id=${this.GITLAB_CLIENT_ID}&redirect_uri=http://localhost:3000/auth/gitlab-callback&response_type=code`,
    };
  }

  handleRequestForAccesToken(code: string): Promise<string> {
    const urlToRequest = `https://gitlab.com/oauth/token?client_id=${this.GITLAB_CLIENT_ID}&client_secret=${this.GITLAB_CLIENT_CODE}&code=${code}&grant_type=authorization_code&redirect_uri=http://localhost:3000/auth/gitlab-callback`;
    return this.httpService
      .post(urlToRequest)
      .pipe(map((result) => result.data.access_token))
      .toPromise();
  }
}

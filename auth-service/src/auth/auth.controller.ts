import { Controller, Get, Inject, Query, Redirect } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { GithubService } from './services/github.service';
import { GitlabService } from './services/gitlab.service';
import { StackService } from './services/stack.service';

@Controller('auth')
export class AuthController {
  constructor(
    @Inject('GITHUB_SERVICE')
    private readonly clientForGithub: ClientProxy,
    @Inject('GITLAB_SERVICE')
    private readonly clientForGitlab: ClientProxy,
    @Inject('STACK_SERVICE')
    private readonly clientForStack: ClientProxy,
    private readonly stackService: StackService,
    private readonly githubService: GithubService,
    private readonly gitlabService: GitlabService,
  ) {}

  @Get('githubLogin')
  @Redirect('')
  githubLogin() {
    return this.githubService.prepareRequestUrlForGithubOAuth();
  }

  @Get('github-callback')
  async githubCallback(@Query('code') code: string) {
    const access_token = await this.githubService
      .handleRequestForAccesToken(code)
      .toPromise();

    this.clientForGithub.emit<string>('github_token', access_token);
    return 'ok';
  }

  @Get('gitlabLogin')
  @Redirect('')
  gitlabLogin() {
    return this.gitlabService.prepareUrlToRequestOAuthLogin();
  }
  @Get('gitlab-callback')
  async gitlabCallback(@Query('code') code: string) {
    try {
      const access_token = await this.gitlabService.handleRequestForAccesToken(
        code,
      );
      this.clientForGitlab.emit<string>('gitlab_token', access_token);
      return code;
    } catch (err) {
      console.log(err);
    }
  }
  @Get('stackLogin')
  @Redirect('')
  stackLogin() {
    return this.stackService.prepareUrlToRequestOAuthLogin();
  }
  @Get('stack-callback')
  async stackCallback(@Query('code') code: string) {
    try {
      const access_token = await this.stackService.handleRequestForAccesToken(
        code,
      );
      this.clientForStack.emit<string>('stack_token', access_token);
      return 'ok';
    } catch (err) {
      console.log(err);
    }
  }
}

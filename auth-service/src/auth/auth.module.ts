import { HttpModule, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AuthController } from './auth.controller';
import rabbitMqLink from '../consts';
import { GithubService } from './services/github.service';
import { GitlabService } from './services/gitlab.service';
import { StackService } from './services/stack.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'GITHUB_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: [rabbitMqLink],
          queue: 'github-auth',
          queueOptions: {
            durable: false,
          },
        },
      },
      {
        name: 'GITLAB_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: [rabbitMqLink],
          queue: 'gitlab-auth',
          queueOptions: {
            durable: false,
          },
        },
      },
      {
        name: 'STACK_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: [rabbitMqLink],
          queue: 'stack-auth',
          queueOptions: {
            durable: false,
          },
        },
      },
    ]),
    ConfigModule,
    HttpModule,
  ],
  controllers: [AuthController],
  providers: [GithubService, GitlabService, StackService],
})
export class AuthModule {}

import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ConfigService } from '@nestjs/config'
import helmet from 'helmet'
import * as compression from 'compression'
import { Logger, LoggerErrorInterceptor } from 'nestjs-pino'
import * as session from 'express-session'
import { VersioningType, ValidationPipe } from '@nestjs/common'
import { setupSwagger } from './doc'
async function bootstrap() {
    const app = await NestFactory.create(AppModule, { bufferLogs: true })
    app.useGlobalPipes(new ValidationPipe())
    app.use(helmet())
    app.use(compression())
    app.enableCors()
    app.useLogger(app.get(Logger))
    app.useGlobalInterceptors(new LoggerErrorInterceptor())
    const configService = app.get(ConfigService)
    const port = configService.get('app.port')
    app.use(
        session({
            secret: configService.get('app.sessionSecret'),
            resave: false,
            saveUninitialized: false,
            cookie: {
                secure: configService.get('app.nodeEnv') === 'production',
                httpOnly: true,
            },
        })
    )
    setupSwagger(app)

    app.enableVersioning({
        type: VersioningType.URI,
        defaultVersion: '1',
        prefix: 'api/v',
    })

    await app.listen(port)
}
bootstrap()

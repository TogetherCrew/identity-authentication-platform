import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ConfigService } from '@nestjs/config'
import helmet from 'helmet'
import * as compression from 'compression'
import { Logger, LoggerErrorInterceptor } from 'nestjs-pino'
import * as session from 'express-session'
import { VersioningType, ValidationPipe } from '@nestjs/common'
import { setupSwagger } from './doc'
import { HttpExceptionFilter } from './shared/filters/http-exception.filter'

async function bootstrap() {
    const app = await NestFactory.create(AppModule, { bufferLogs: true })
    app.useLogger(app.get(Logger))
    app.useGlobalInterceptors(new LoggerErrorInterceptor())
    app.useGlobalFilters(new HttpExceptionFilter())
    app.useGlobalPipes(new ValidationPipe())
    app.use(helmet())
    app.use(compression())
    app.enableCors()

    const configService = app.get(ConfigService)
    const port = configService.get('app.port')

    app.use(
        session({
            secret: configService.get('app.sessionSecret'),
            resave: false,
            saveUninitialized: false,
        })
    )

    app.enableVersioning({
        type: VersioningType.URI,
        defaultVersion: '1',
        prefix: 'api/v',
    })

    setupSwagger(app)

    await app.listen(port, () => {
        const logger = app.get(Logger)
        logger.log(`Server is running on port ${port}..`, 'NestApplication')
    })
}

bootstrap()

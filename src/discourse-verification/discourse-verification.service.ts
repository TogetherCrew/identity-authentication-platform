import { lastValueFrom } from 'rxjs';
import { VerificationJwtPayload } from 'src/jwt/types/jwt-payload.type';

import { HttpService } from '@nestjs/axios';
import { BadRequestException, Injectable } from '@nestjs/common';

import { JwtService } from '../jwt/jwt.service';
import { CryptoUtilsService } from '../utils/crypto-utils.service';
import { GenerateVerificationTokenDto } from './dto/generate-verification-token.dto';
import { VerifyDto } from './dto/verify.dto';

@Injectable()
export class DiscourseVerificationService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly cryptoUtilsService: CryptoUtilsService,
        private readonly httpService: HttpService
    ) {}

    async generateVerificationToken(
        generateVerificationTokenDto: GenerateVerificationTokenDto
    ): Promise<string> {
        const { siweJwt } = generateVerificationTokenDto;
        await this.jwtService.validateToken(siweJwt);
        const verificationCode =
            this.cryptoUtilsService.generateVerificationCode();
        return this.jwtService.generateVerificationToken(verificationCode);
    }

    async verifyDiscourseTopic(verifyDto: VerifyDto): Promise<any> {
        const topicUrl = this.normalizeTopicUrl(verifyDto.topicUrl);
        const payload = (await this.jwtService.validateToken(
            verifyDto.verificationJwt
        )) as VerificationJwtPayload;

        const topicData = await this.fetchTopicData(topicUrl);
        this.validateTopicData(topicData, payload);

        const firstPost = topicData?.post_stream?.posts?.[0];
        if (!firstPost?.user_id) {
            throw new BadRequestException(
                'Could not determine user ID from the topic'
            );
        }
        const urlObj = new URL(verifyDto.topicUrl);
        const baseURL = urlObj.origin;

        const discourseJwt = await this.jwtService.generateAuthJwt(
            firstPost?.user_id,
            'discourse',
            { baseURL }
        );
        return discourseJwt;
    }

    private normalizeTopicUrl(url: string): string {
        if (!url.endsWith('.json')) {
            return url.endsWith('/') ? `${url}json` : `${url}.json`;
        }
        return url;
    }

    private async fetchTopicData(url: string): Promise<any> {
        try {
            const response = await lastValueFrom(this.httpService.get(url));
            return response.data;
        } catch (error) {
            throw new BadRequestException(
                'Failed to retrieve Discourse topic JSON'
            );
        }
    }

    private validateTopicData(
        topicData: any,
        jwtPayload: VerificationJwtPayload
    ): void {
        const posts = topicData?.post_stream?.posts || [];
        if (!posts.length) {
            throw new BadRequestException('No posts found in the topic');
        }

        const firstPost = posts[0];
        const content = firstPost?.cooked || '';
        if (!content.includes(jwtPayload.code)) {
            throw new BadRequestException(
                'Verification code not found in topic content'
            );
        }
    }
}

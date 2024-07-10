// import { Controller, Get, Query, Redirect, Req, Res } from '@nestjs/common';
// import { AuthDiscordService } from './auth-discord.service';
// import { Request, Response } from 'express';

// @Controller('auth-discord')
// export class AuthDiscordController {
//   constructor(private authDiscordService: AuthDiscordService) {}

//   @Get('/authenticate')
//   @Redirect()
//   redirectToDiscordAuth() {
//     const url = this.authDiscordService.redirectToDiscord();
//     return { url: url };
//   }

//   @Get('/authenticate/callback')
//   async handleDiscordCallback(@Query('code') code: string, @Res() res: Response) {
//     try {
//       const jwt = await this.authDiscordService.handleOAuth2Callback(code);
//       res.redirect(`https://your-frontend.com?token=${jwt}`); // Redirect user to the frontend with the JWT
//     } catch (error) {
//       res.status(401).send('Authentication failed');
//     }
//   }
// }

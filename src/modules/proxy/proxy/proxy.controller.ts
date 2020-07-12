import { Controller, Req, Post, Body } from '@nestjs/common';
import { ProxyService } from './proxy.service';
import { Request } from 'express';

@Controller('/api')
export class ProxyController {
  constructor(private readonly proxyService: ProxyService) {}

  @Post('/v2/local/search/address.json')
  async searchAddress(@Req() req: Request, @Body() data: any) {
    let res;
    console.log('body', data);
    try {
      res = await this.proxyService.get(
        `${req.url.replace('/api', '')}`,
        {},
        { query: data['query'] },
      );
    } catch (error) {
      console.log('error', error);
    }
    return res;
  }

  @Post('/v2/local/search/keyword.json')
  async searchKeyword(@Req() req: Request, @Body() data: any) {
    console.log('searchKeyword', req.url);
    let res;
    try {
      res = await this.proxyService.get(
        `${req.url.replace('/api', '')}`,
        {},
        { query: data['query'] },
      );
    } catch (error) {
      console.log('error', error);
    }
    return res;
  }
}

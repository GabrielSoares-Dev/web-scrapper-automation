import { Inject, Injectable } from '@nestjs/common';
import { RoomsServiceInterface } from '@application/services/rooms.service';
import { GetRoomsServiceInputDto } from '@application/dtos/services/rooms/getRoomsInput.dto';
import { GetRoomsServiceOutputDto } from '@application/dtos/services/rooms/getRoomsOutput.dto';
import puppeteer from 'puppeteer-core';
import type { Page } from 'puppeteer-core';
import {
  LOGGER_SERVICE_TOKEN,
  LoggerServiceInterface,
} from '@application/services/logger.service';

@Injectable()
export class RoomsService implements RoomsServiceInterface {
  @Inject(LOGGER_SERVICE_TOKEN)
  private readonly loggerService: LoggerServiceInterface;

  private readonly browserServerURL = `${process.env.BROWSERLESS_URL}?token=${process.env.BROWSERLESS_TOKEN}`;
  private readonly dataSourceURL = process.env.DATA_SOURCE_URL;

  private buildUrl(input: GetRoomsServiceInputDto): string {
    return `${this.dataSourceURL}?entrada=${input.checkIn}&saida=${input.checkOut}&adultos=1#acomodacoes`;
  }

  private async findRoomsFromDataSource(
    page: Page,
  ): Promise<GetRoomsServiceOutputDto> {
    return await page.evaluate(() => {
      const noAvailableRoomsElement = document.querySelector('.msgSemQuarto');
      const noRoomsAvailable =
        noAvailableRoomsElement &&
        window.getComputedStyle(noAvailableRoomsElement).display !== 'none';

      if (noRoomsAvailable) return [];

      const section = document.querySelector(
        'section[data-name="acomodacoes"]',
      );
      if (!section) return [];

      const elements = section.querySelectorAll('[data-codigo]');
      return Array.from(elements).map((element) => {
        const name =
          element.querySelector('[data-campo="titulo"]')?.textContent || '';
        const description =
          element
            .querySelector('.quarto.descricao')
            ?.textContent.replace(/\s+/g, ' ')
            .trim() || '';
        const priceElement = element.querySelector('[data-campo="valor"]');
        const price = priceElement
          ? priceElement.textContent?.replace(/\s+/g, ' ').trim()
          : null;
        const image =
          element
            .querySelector('[data-fancybox="images"]')
            ?.getAttribute('href') || null;

        return {
          name,
          description,
          price,
          image,
        };
      });
    });
  }

  async getRooms(
    input: GetRoomsServiceInputDto,
  ): Promise<GetRoomsServiceOutputDto> {
    const browser = await puppeteer.connect({
      browserWSEndpoint: this.browserServerURL,
    });
    const page = await browser.newPage();

    try {
      const url = this.buildUrl(input);
      await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });

      const rooms = await this.findRoomsFromDataSource(page);

      return rooms;
    } catch (error) {
      this.loggerService.error('Error fetching rooms data:', error);
      throw new Error('Failed to fetch room data.');
    } finally {
      await browser.close();
    }
  }
}

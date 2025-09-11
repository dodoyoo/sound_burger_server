import { Request, Response } from 'express';
import {
  InvalidPropertyError,
  PropertyRequiredError,
} from '../../utils/customError';
import { reportErrorMessage } from '../../utils/errorHandling';
import { Music } from './musicEntity';
import { MusicRepository } from './musicRepository';

export class MusicController {
  private musicRepository: MusicRepository;

  constructor(musicRepository: MusicRepository) {
    this.musicRepository = musicRepository;
  }

  public async playList(req: Request, res: Response) {
    try {
    } catch (err: unknown) {}
  }
}

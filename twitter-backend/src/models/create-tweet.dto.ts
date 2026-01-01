export class CreateTweetDto {
  constructor(
    public description: string,
    public images?: string[],
  ) {}
}

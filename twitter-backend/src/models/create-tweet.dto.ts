export class CreateTweetDto {
  constructor(
    public description: string,
    public image?: string,
  ) {}
}

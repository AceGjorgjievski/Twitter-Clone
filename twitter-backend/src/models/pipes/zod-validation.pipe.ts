import {
  ArgumentMetadata,
  BadRequestException,
  PipeTransform,
} from '@nestjs/common';
import { ZodSchema } from 'zod';

export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: ZodSchema) {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  transform(value: any, metadata: ArgumentMetadata) {
    const parsed = this.schema.safeParse(value);
    if (parsed.success) return parsed.data;

    // Flatten Zod errors into a simple message array
    const messages = parsed.error.issues.map((issue) => issue.message);

    // Throw a single message (first) or all messages
    throw new BadRequestException({
      message: messages.length === 1 ? messages[0] : messages,
    });
  }
}

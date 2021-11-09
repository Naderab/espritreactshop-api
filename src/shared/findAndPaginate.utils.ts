import { Repository } from 'typeorm';
import { throwError } from './throw-error.utils';

/**
 * Find entity with matched field
 * @param repository  corresponding entity repository
 * @param condition object containing conditions
 * @example {status : true, title: "xyz" }
 * {title : "some title to check if exisits"}
 * @param take How many entities to return
 * @param skip How many entities to skip
 * @param omitError whether to throw error if entity not found
 * @default false
 * @param insensitive if string check is case insensitive
 * @default true
 * @returns the entity found else null
 */
export async function findAndPaginate<T>(
  repository: Repository<T>,
  condition = {},
  take: number,
  skip: number,
  omitError = false,
  insensitive = true
): Promise<[T[], number]> {
  const regexCondition: { [k: string]: any } = {};

  Object.entries(condition).forEach(entry => {
    const [key, value] = entry;
    regexCondition[key] = new RegExp(`^${value}$`, insensitive ? 'i' : undefined);
  });

  let entity: [T[], number] = null;

  const order = { createdAt: -1 } as any;

  entity = await repository.findAndCount({
    where: condition,
    take,
    skip,
    order
  });

  if (omitError === true && !entity) {
    throwError({ [repository.metadata.tableName]: 'Not found' }, 'Entity not found your parameters ', 404);
  }

  return entity;
}

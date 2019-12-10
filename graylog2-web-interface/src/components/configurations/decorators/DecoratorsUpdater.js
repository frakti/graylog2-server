// @flow strict
import { difference } from 'lodash';

import CombinedProvider from 'injection/CombinedProvider';
import type { DecoratorType } from './DecoratorsConfigUpdate';

const { DecoratorsActions } = CombinedProvider.get('Decorators');

const DecoratorsUpdater = (newDecorators: Array<DecoratorType>, oldDecorators: Array<DecoratorType>) => {
  const createdDecorators = newDecorators.filter(({ id }) => !id);
  const updatedDecorators = newDecorators.filter(({ id }) => id)
    .filter(decorator => decorator !== oldDecorators.find(oldDecorator => oldDecorator.id === decorator.id));
  const deletedDecoratorIds = difference(oldDecorators.map(({ id }) => id).sort(), newDecorators.map(({ id }) => id).sort());

  return [
    ...createdDecorators.map(newDecorator => () => DecoratorsActions.create(newDecorator)),
    ...updatedDecorators.map(updatedDecorator => () => DecoratorsActions.update(updatedDecorator.id, updatedDecorator)),
    ...deletedDecoratorIds.map(deletedID => () => DecoratorsActions.remove(deletedID)),
  ].reduce((prev, cur) => prev.then(() => cur()), Promise.resolve());
};

export default DecoratorsUpdater;

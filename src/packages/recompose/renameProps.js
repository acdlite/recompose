import curry from 'lodash/function/curry';
import omit from 'lodash/object/omit';
import pick from 'lodash/object/pick';
import mapKeys from 'lodash/object/mapKeys';
import wrapDisplayName from './wrapDisplayName';
import mapProps from './mapProps';

const { keys } = Object;

const renameProps = (nameMap, BaseComponent) => {
  const RenameProps = mapProps(props => ({
    ...omit(props, keys(nameMap)),
    ...mapKeys(
      pick(props, keys(nameMap)),
      (_, oldName) => nameMap[oldName]
    )
  }), BaseComponent);

  RenameProps.displayName = wrapDisplayName(BaseComponent, 'renameProps');

  return RenameProps;
};

export default curry(renameProps);

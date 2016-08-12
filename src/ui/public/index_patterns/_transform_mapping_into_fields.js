import _ from 'lodash';
import IndexPatternsMapFieldProvider from 'ui/index_patterns/_map_field';
export default function transformMappingIntoFields(Private, kbnIndex, config) {
  let mapField = Private(IndexPatternsMapFieldProvider);


  /**
   * Convert the ES response into the simple map for fields to
   * mappings which we will cache
   *
   * @param  {object} response - complex, excessively nested
   *                           object returned from ES
   * @return {object} - simple object that works for all of kibana
   *                    use-cases
   */
  return function (response) {
    let fields = {};
    _.each(response, function (index, indexName) {
      if (indexName === kbnIndex) return;
      _.each(index.mappings, function (mappings) {
        _.each(mappings, function (field, name) {
          let keys = Object.keys(field.mapping);
          if (keys.length === 0 || (name[0] === '_') && !_.contains(config.get('metaFields'), name)) return;

          let mapping = mapField(field, name);
          const indexType = 'Index: ' + indexName + ', Type: ' + mapping.type + ';';
          mapping.indicesTypes = indexType;

          if (fields[name]) {
            mapping.indicesTypes = fields[name].indicesTypes + mapping.indicesTypes;
            if (fields[name].type !== mapping.type) {
              // conflict fields are not available for much except showing in the discover table
              mapping.type = 'conflict';
              mapping.indexed = false;
            }
          }
          fields[name] = _.pick(mapping, 'type', 'indexed', 'analyzed', 'doc_values', 'indicesTypes');
        });
      });
    });

    config.get('metaFields').forEach(function (meta) {
      if (fields[meta]) return;

      let field = { mapping: {} };
      field.mapping[meta] = {};
      fields[meta] = mapField(field, meta);
    });

    return _.map(fields, function (mapping, name) {
      mapping.name = name;
      return mapping;
    });
  };
};

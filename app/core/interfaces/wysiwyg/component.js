define(['core/interfaces/wysiwyg/interface', 'core/UIComponent', 'core/t'], function (Input, UIComponent, __t) {
  return UIComponent.extend({
    id: 'wysiwyg',
    dataTypes: ['VARCHAR', 'TEXT', 'MEDIUMTEXT', 'LONGTEXT'],
    Input: Input,
    variables: [
      {id: 'buttons', type: 'String', default_value: 'bold,italic,underline,anchor,h2,h3,quote', ui: 'select', options: {
        select_multiple: true,
        options: {
          bold: 'Bold',
          italic: 'Italic',
          underline: 'Underline',
          strikethrough: 'Strikethrough',
          subscript: 'Subscript',
          superscript: 'Superscript',
          anchor: 'Link',
          quote: 'Quote',
          pre: 'Pre',
          orderedlist: 'Ordered List',
          unorderedlist: 'Unordered List',
          h1: 'H1',
          h2: 'H2',
          h3: 'H3',
          h4: 'H4',
          h5: 'H5',
          h6: 'H6',
          removeFormat: 'Remove all formatting'
        }
      }}
    ],
    validate: function (value, options) {
      if (options.view.isRequired() && !value) {
        return __t('this_field_is_required');
      }
    },
    list: function (options) {
      return options.value ? options.value.toString().replace(/(<([^>]+)>)/ig, '').substr(0, 100) : '';
    }
  });
});

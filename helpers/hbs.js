const moment = require( 'moment' );

var he = require('he');

module.exports = {
  formatDate: function (date, format) {
    return moment(date).utc().format(format);
  },
  truncate: function (str, len) {
    if (str.length > len && str.length > 0) {
      let new_str = str + ' ';
      new_str = str.substr(0, len);
      new_str = str.substr(0, new_str.lastIndexOf(' '));
      new_str = new_str.length > 0 ? new_str : str.substr(0, len);
      return new_str + '...read more';
    }
    return str;
  },

  stripTags: function (input) {
    const stripedHtml = input.replace( /<[^>]+>/g, '' );
    return he.decode(stripedHtml);
  },

  editIcon: function (storyUser, loggedUser, storyId, floating = true) {
    if (storyUser._id.toString() == loggedUser._id.toString()) {
      if (floating) {
        return `<a href="/stories/edit/${storyId}" class="btn-floating halfway-fab"><i class="fas fa-edit light-blue lighten-4"></i></a>`;
      } else {
        return `<a href="/stories/edit/${storyId}"><i class="fas fa-edit"></i></a>`;
      }
    } else {
      return '';
    }
  },
  select: function (selected, options) {
    return options
      .fn(this)
      .replace(
        new RegExp(' value="' + selected + '"'),
        '$& selected="selected"'
      )
      .replace(
        new RegExp('>' + selected + '</option>'),
        ' selected="selected"$&'
      );
  },

  

  condition: function ( v1, operator, v2, options )
  {

    switch ( operator )
    {
      case '==':
        return ( v1 == v2 ) ? options.fn( this ) : options.inverse( this );
      case '===':
        return ( v1 === v2 ) ? options.fn( this ) : options.inverse( this );
      case '!=':
        return ( v1 != v2 ) ? options.fn( this ) : options.inverse( this );
      case '!==':
        return ( v1 !== v2 ) ? options.fn( this ) : options.inverse( this );
      case '<':
        return ( v1 < v2 ) ? options.fn( this ) : options.inverse( this );
      case '<=':
        return ( v1 <= v2 ) ? options.fn( this ) : options.inverse( this );
      case '>':
        return ( v1 > v2 ) ? options.fn( this ) : options.inverse( this );
      case '>=':
        return ( v1 >= v2 ) ? options.fn( this ) : options.inverse( this );
      case '&&':
        return ( v1 && v2 ) ? options.fn( this ) : options.inverse( this );
      case '||':
        return ( v1 || v2 ) ? options.fn( this ) : options.inverse( this );
      default:
        return options.inverse( this );
    }
  }
};

NEWSBLUR.Views.Folder = Backbone.View.extend({

    className: 'folder',
    
    tagName: 'li',
    
    options: {
        depth: 0,
        collapsed: false,
        title: '',
        root: false
    },
    
    render: function() {
        var depth = this.options.depth;
        this.options.collapsed =  _.contains(NEWSBLUR.Preferences.collapsed_folders, this.options.title);
        var $feeds = this.collection.map(function(item) {
            var $model;
            if (item.is_feed()) {
                var feed_view = new NEWSBLUR.Views.Feed({model: item.feed, type: 'feed', depth: depth}).render();
                item.feed.views.push(feed_view);
                return feed_view.el;
            } else {
                return new NEWSBLUR.Views.Folder({
                    collection: item.folders,
                    depth: depth + 1,
                    title: item.get('folder_title')
                }).render().el;
            }
        });
        $feeds.push(this.make('div', { 'class': 'feed NB-empty' }));

        var $folder = this.render_folder();
        $(this.el).html($folder);
        this.$('.folder').append($feeds);

        return this;
    },
    
    render_folder: function($feeds) {
        var $folder = _.template('\
        <% if (!root) { %>\
            <div class="folder_title <% if (depth == 0) { %>NB-toplevel<% } %>">\
                <div class="NB-folder-icon"></div>\
                <div class="NB-feedlist-collapse-icon" title="<% if (is_collapsed) { %>Expand Folder<% } else {%>Collapse Folder<% } %>"></div>\
                <div class="NB-feedlist-manage-icon"></div>\
                <span class="folder_title_text"><%= folder_title %></span>\
            </div>\
        <% } %>\
        <ul class="folder <% if (root) { %>NB-root<% } %>" <% if (is_collapsed) { %>style="display: none"<% } %>>\
        </ul>\
        ', {
          depth         : this.options.depth,
          folder_title  : this.options.title,
          is_collapsed  : this.options.collapsed,
          root          : this.options.root
        });

        return $folder;
    }
    
});
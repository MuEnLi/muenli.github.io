/**/
/* load images */
/**/
function load_images(attr)
{
	jQuery('img').each(function()
	{
		if( jQuery(this).data(attr) )
			jQuery(this).attr('src', jQuery(this).data(attr));
	});
}

/**/
/* on scroll event */
/**/
jQuery(window).scroll(function()
{
	var scroll = jQuery(this).scrollTop() + 1;
	
	if( scroll > jQuery('#intro').height() )
	{
		jQuery('.main-nav, .filters-nav').addClass('fixed');		
	}
	else
	{
		jQuery('.main-nav, .filters-nav').removeClass('fixed');			
	}	
	
	if( scroll > jQuery('#footer').offset().top - 90 )
	{
		jQuery('#main-nav a[href="#page=footer"]').addClass('current').siblings().removeClass('current');
		jQuery('#main-nav .switcher strong').html(jQuery('#main-nav a[href="#page=footer"]').text());
		jQuery('#about-filter').fadeOut('fast');
	}
	else if( scroll > jQuery('#about').offset().top - 90 )
	{
		jQuery('#main-nav a[href="#page=about"]').addClass('current').siblings().removeClass('current');
		jQuery('#main-nav .switcher strong').html(jQuery('#main-nav a[href="#page=about"]').text());
		jQuery('#about-filter').fadeIn('fast').siblings().fadeOut('fast');
	}
	else if( scroll > jQuery('#portfolio').offset().top )
	{
		jQuery('#main-nav a[href="#page=portfolio"]').addClass('current').siblings().removeClass('current');
		jQuery('#main-nav .switcher strong').html(jQuery('#main-nav a[href="#page=portfolio"]').text());
		jQuery('#portfolio-filter').fadeIn('fast').siblings().fadeOut('fast');
		
		if( jQuery('#portfolio').hasClass('opened') )
		{
			var hashOptions = window.location.hash ? jQuery.deparam.fragment(window.location.hash, true) : {};
			var id = hashOptions['id'] || 0;
			var aside = jQuery('#portfolio' + id + ' aside');
			
			if( scroll > jQuery('#portfolio').offset().top )
			{
				if( scroll + aside.height() + 90 > jQuery('#about').offset().top )
					aside.css('padding-top', jQuery('#portfolio').height() - 45 - aside.height());
				else
					aside.css('padding-top', scroll - jQuery('#portfolio').offset().top);
			}
			else
				jQuery('#portfolio aside').css('padding-top', 0);
		}
	}
	else
	{
		jQuery('#portfolio aside').css('padding-top', 0);
		jQuery('#main-nav a[href="#page=home"]').addClass('current').siblings().removeClass('current');
		jQuery('#portfolio-filter').fadeIn('fast').siblings().fadeOut('fast');	
	}
});


/**/
/* on resize event */
/**/
var colWidth = 336;
var aboutColWidth = 252;
jQuery(window).resize(function()
{
	if( jQuery(window).width() < 756 )
	{
		colWidth = 154;
		aboutColWidth = 154;
	}
	else if( jQuery(window).width() < 1008 )
	{
		colWidth = 252;
		aboutColWidth = 252;
	}
	else if( jQuery(window).width() >= 1008)
	{
		colWidth = 336;
		aboutColWidth = 252;
	}
	jQuery('#portfolio ul').isotope({
		masonry: {columnWidth: colWidth}
	});
	jQuery('#about ul').isotope({
		masonry: {columnWidth: aboutColWidth}
	});

	jQuery('#intro').height(jQuery(window).height());	
});


jQuery(function()
{
	/**/
	/* init */
	/**/
	load_images('src');
	jQuery('#intro').height(jQuery(window).height());
	
	/**/
	/* main nav */
	/**/
	jQuery('#main-nav').on('click', 'a:first-child', function()
	{
		return false;
	});	
	
	
	/**/
	/* portfolio */
	/**/
	if( jQuery(window).width() < 756 )
	{
		colWidth = 154;
	}
	else if( jQuery(window).width() < 1008 )
	{
		colWidth = 252;
	}	
	jQuery('#portfolio ul').isotope({
		itemSelector : 'li',
		masonry: {columnWidth: colWidth},
		filter: '.all, .more',
		getSortData: { sort: function($elem) {return parseInt( $elem.data('sort') || 4 );} },    
		sortBy: 'sort'
	});
	jQuery('#portfolio').on('click', '.prev, .next', function()
	{
		if( jQuery(this).hasClass('disabled') )
			return false;
	});
	jQuery('#portfolio').on('click', '.more a', function()
	{
		loader = $(this);
		page = $(this).data('page');
		
		$.get('ajax/portfolio'  + page + '.html?asd').done(function(data)
		{
			jQuery('#portfolio ul').isotope('insert', $(data));
			loader.data('page', ++page);
			load_images('src');
			load_images('src2');
			
			$.get('ajax/portfolio' + page + '.html').fail(function()
			{
				jQuery('#portfolio ul').isotope('remove', loader.parent());
			});
		}).fail(function()
		{
			jQuery('#portfolio ul').isotope('remove', loader.parent());
		});
		
		return false;
	});
	
	
	/**/
	/* about */
	/**/
	if( jQuery(window).width() < 756 )
	{
		aboutColWidth = 154;
	}
	jQuery('#about ul').isotope({
		itemSelector : 'li',
		masonry: {columnWidth: aboutColWidth},
		filter: '.all',
		getSortData: { sort: function($elem) {return parseInt( $elem.data('sort') || 4 );} },    
		sortBy: 'sort'
	});
	jQuery('#about').on('click', '.more a', function()
	{
		loader = $(this);
		page = $(this).data('page');
		
		$.get('ajax/about'  + page + '.html').done(function(data)
		{
			jQuery('#about ul').isotope('insert', $(data));
			loader.data('page', ++page);
			load_images('src');
			load_images('src2');
			
			$.get('ajax/about' + page + '.html').fail(function()
			{
				jQuery('#about ul').isotope('remove', loader.parent());
			});
		}).fail(function()
		{
			jQuery('#about ul').isotope('remove', loader.parent());
		});
		
		return false;
	});
});


jQuery(window).load(function()
{	
	/**/
	/* init */
	/**/
	load_images('src2');
	jQuery('body').addClass('loaded');
	
	
	/**/
	/* scroll */
	/**/
	jQuery('#scroll').on('click', function()
	{
		window.location.hash = jQuery(this).attr('href');
		jQuery(window).trigger('hashchange');
		return false;
	});
	
	
	/**/
	/* hashchange */
	/**/
	jQuery(window).bind('hashchange', function(event)
	{
		var hashOptions = window.location.hash ? jQuery.deparam.fragment(window.location.hash, true) : {};
		var page = hashOptions['page'] || 'home';
		var type = hashOptions['type'] || 'all';
		var id = hashOptions['id'] || 0;
		
		if( page == 'home' )
		{
			jQuery('html, body').animate({scrollTop: 0});
		}
		else if( page == 'portfolio' )
		{
			jQuery('html, body').animate({scrollTop: jQuery('#portfolio').offset().top});
			
			if( id )
			{
				jQuery('#portfolio' + id + ' .close').attr('href', '#page=portfolio&type=' + jQuery('#portfolio-filter .current a').data('filter').substr(1));
				
				if( jQuery('#portfolio' + id).prevAll(jQuery('#portfolio-filter .current a').data('filter')).length > 2 )
					jQuery('#portfolio' + id + ' .prev').attr('href', jQuery('#portfolio' + id).prevAll(jQuery('#portfolio-filter .current a').data('filter')).eq(1).find('a').attr('href')).removeClass('disabled');
				else
					jQuery('#portfolio' + id + ' .prev').addClass('disabled');
				
				if( jQuery('#portfolio' + id).nextAll(jQuery('#portfolio-filter .current a').data('filter')).length > 0 )
					jQuery('#portfolio' + id + ' .next').attr('href', jQuery('#portfolio' + id).nextAll(jQuery('#portfolio-filter .current a').data('filter')).eq(0).find('a').attr('href')).removeClass('disabled');
				else
					jQuery('#portfolio' + id + ' .next').addClass('disabled');					
				
				jQuery('#portfolio').addClass('opened');
				if( jQuery('#portfolio' + id).data('bg') )
					jQuery('#portfolio').css('background', jQuery('#portfolio' + id).data('bg'));
				else
					jQuery('#portfolio').css('background', '#ffffff');					
					
			 	jQuery('#portfolio ul').isotope(
			 	{
			 		filter: '#portfolio' + id
				});
			}
			else
			{
				var elem = jQuery('#portfolio-filter a[href="#page=portfolio&type=' + type + '"]');
				elem.parent().addClass('current').siblings().removeClass('current');
		
				jQuery('#portfolio').removeClass('opened').css('background', '#ffffff');
			 	jQuery('#portfolio ul').isotope(
			 	{
			 		filter: '.more, .' + type
				});			
			}
		}
		else if( page == 'about' )
		{
			jQuery('html, body').animate({scrollTop: jQuery('#about').offset().top});
			
			var elem = jQuery('#about-filter a[href="#page=about&type=' + type + '"]');
			elem.parent().addClass('current').siblings().removeClass('current');
			
		 	jQuery('#about ul').isotope(
		 	{
		 		filter: '.more, .' + type
			});
		}
		else if( page == 'footer' )
		{
			jQuery('html, body').animate({scrollTop: jQuery('#footer').offset().top});
		}
	}).trigger('hashchange');
	
});
var previousButtonId = "";
var previousTileId = "";
var currentScale = 0;
var currentScaleEdge = 0;
var audioClips = null;
var playAudio = false;

function create_element(content)
{
    var parent = document.createElement('div');
    parent.innerHTML = content;
    return parent.firstElementChild;
}

function scroll_element_to_top(element)
{
    var panel = document.documentElement;

    if (panel.clientHeight < panel.scrollHeight)
    {
        element.scrollIntoView({ alignToTop: 'true', behavior: 'smooth', block: 'start' });
    }
}

function lerp_string(content, id)
{
    var length = 0;
    var target = document.getElementById(id);
    var interval = 200 / content.length;

    if (target.dataset.tweenHandle != null)
    {
        clearInterval(target.dataset.tweenHandle);
    }

    if (target.dataset.tweenTimeoutHandle != null)
    {
        clearTimeout(target.dataset.tweenTimeoutHandle);
    }

    target.dataset.tweenHandle = window.setInterval(function ()
    {
        if (length <= content.length)
        {
            target.innerHTML = content.substring(0, length)
            ++length;
        }

    }, interval);

    target.dataset.tweenTimeoutHandle = setTimeout(function ()
    {
        clearInterval(target.dataset.tweenHandle);
        target.dataset.tweenHandle = null;
        target.dataset.tweenTimeoutHandle = null;
        target.innerHTML = content;
    },
    interval * content.length + 60);
}

function include_html(target, file, on_load) 
{
	if (file)
	{
		/* Make an HTTP request using the attribute value as the file name: */
		xhttp = new XMLHttpRequest();
		xhttp.onreadystatechange = function() 
		{
			if (this.readyState == 4) 
			{
				if (this.status == 200) 
				{
					target.innerHTML = this.responseText;
					
					if (on_load !== null)
					{
						on_load();
					}
				}
				
				if (this.status == 404) 
				{
					target.innerHTML = "Page not found.";
				}
			}
		}
		xhttp.open("GET", file, true);
		xhttp.send();
		/* Exit the function: */
		return;
	}
}

function set_button_color(element, isActive)
{
    element.style.color = isActive ? "var(--color-button-opaque-selected-fg)" : "var(--color-button-opaque-default-fg)";
    element.style.background = isActive ? "var(--color-button-opaque-selected-bg)" : "var(--color-button-opaque-default-bg)";
}

function play_sound(index, vol)
{
    if (!playAudio)
    {
        return;
    }

    if (audioClips === null)
    {
        audioClips = [];
        audioClips[0] = new Audio('S_Select.wav');
        audioClips[1] = new Audio('S_Enter.wav');
        audioClips[2] = new Audio('S_Shift.wav');
    }

    audioClips[index].volume = vol;
    audioClips[index].play();
}

function udpate_scaling()
{
    var vw = window.innerWidth / 100;
    var vh = window.innerHeight / 100;

    var maxAspectW = 2.0;
    var maxAspectH = 1.6;
    var vwClamped = Math.min(vw, vh * Math.min(vw / vh, maxAspectW));
    var vhClamped = Math.min(vh, vw * Math.min(vh / vw, maxAspectH));

    var length = Math.sqrt(vwClamped * vwClamped + vhClamped * vhClamped);

    currentScale = Math.max(8, length);
	currentScaleEdge = Math.max(1.0, Math.floor(0.12 * currentScale));
	
    document.documentElement.style.setProperty('--cscale', currentScale + "px");
    document.documentElement.style.setProperty('--cscale-edge', currentScaleEdge + "px");
}

function bind_button_hover(button, tag, id)
{
    var button_text = button.getElementsByTagName(tag).item(0);
    button_text.id = "button_content_" + id.toString();
    const content = button_text.innerHTML.toString();
    const content_id = button_text.id.toString();
    button.addEventListener('mouseenter', e => { lerp_string(content, content_id); });
}

function try_update_previous_tile(newId)
{
    var previousTile = document.getElementById(previousTileId);

    if (previousTile !== null)
    {
        set_button_color(previousTile, false);
    }

    if (previousTileId === newId)
    {
        previousTileId = null;
        return false;
    }

    previousTileId = newId;
    return true;
}

function try_update_previous_tile_video(newId)
{
    var previousTile = document.getElementById(previousTileId);

    if (previousTile !== null)
    {
		set_button_color(previousTile, false);
    }
	
	var element = document.getElementById(newId);

	if (element !== null && element.hasAttribute("data-expanded"))
	{
		element.parentElement.replaceWith(element);
		element.removeAttribute("data-expanded");
		set_button_color(element, false);
		return false;
	}

	element.setAttribute("data-expanded",true);
    previousTileId = newId;
    return true;
}

function cancel_tile_tweens()
{
	var tiles = document.getElementsByClassName("tile_button");

    for (var i = 0; i < tiles.length; i++)
    {
        var tile = tiles.item(i);
		
		if (tiles.item(i).dataset.tweenTimeoutHandle != null)
        {
			clearTimeout(tiles.item(i).dataset.tweenTimeoutHandle);
			tiles.item(i).dataset.tweenTimeoutHandle = null;
        }
    }
}

function update_subpage()
{
	previousTileId = null;
	
	// Bind buttons now in dom.
    var tiles = document.getElementsByClassName("tile_button");

    for (var i = 0; i < tiles.length; i++)
    {
        var tile = tiles.item(i);
        bind_button_hover(tile, "h2", "tile_button_" + i.toString());
		
		if (tile.dataset.content != null)
        {
            const tileid = "tile_id_" + i.toString();
            tile.id = tileid;
            tile.addEventListener('click', e => { expand_tile(tileid.toString(), true); play_sound(2, 0.15); });
            tile.addEventListener('mouseenter', e => { play_sound(0, 0.15); });
        }
    }

    var initialId = "0";

    var panel = document.getElementsByClassName("panel").item(0);
	
    if (panel !== null && panel.hasAttribute("data-initialId"))
    {
        initialId = panel.getAttribute("data-initialId");
        console.log(initialId);
    }
	
    setTimeout(function () { expand_tile("tile_id_" + initialId, true); }, 250);
	
	if (panel != null && panel.hasAttribute("data-unfold"))
	{	
		for (var i = 1; i < tiles.length; i++)
		{			
			if (tiles.item(i).dataset.content != null)
			{
				const tileid = tiles.item(i).id;
				tiles.item(i).dataset.tweenTimeoutHandle = setTimeout(function () { expand_tile(tileid.toString(), false); }, 350 * (i + 1));
			}
		}
	}
}

function expand_tile(id, do_focus)
{
    var element = document.getElementById(id);
	
	if (element === null)
	{
		return;
	}
	
    var expand_div = document.getElementById('expand_div');

    if (expand_div !== null)
    {
        expand_div.remove();
    }

    set_button_color(element, true);

	element.dataset.tweenTimeoutHandle = null;

	
    switch (element.dataset.behavior)
    {
        case "local_document":
			if (try_update_previous_tile(id))
			{
				element.insertAdjacentHTML("afterend", "<div id='expand_div' class='tile_parent'></div>");
				include_html(document.getElementById('expand_div'), element.dataset.content, null);
				break;
			}
            return;
			
        case "local_image":
			if (try_update_previous_tile(id))
			{
				element.insertAdjacentHTML("afterend", "<div id='expand_div' class='tile_parent' style='animation-name:ClipIn_Left_TileExtendedTall'><div class='image_wide'><img src='" + element.dataset.content + "'/></div></div>");
				break;
			}
            return;
			
        case "local_video":
			if (try_update_previous_tile_video(id))
			{
                element.style.animationDuration = "0.0s";
                var newparent = create_element("<div style='display: inline-table; position: relative;' id='content_container'></div>");
                element.parentElement.replaceChild(newparent, element);
                newparent.appendChild(element);
                element.insertAdjacentHTML("afterend", "<div class='video_right' style='max-width:0px;'><video loop autoplay muted><source src=''></video></div>");

                var image = newparent.lastElementChild;
                var video = newparent.lastElementChild.lastElementChild;
                video.src = element.dataset.content;
                video.addEventListener('loadeddata', function () { image.style.maxWidth = ''; }, false);
				break;
			}
            return;

        case "local_video_embed":
			if (try_update_previous_tile_video(id))
			{
				element.style.animationDuration = "0.0s";
                var newparent = create_element("<div style='display: inline-table; position: relative;' id='content_container'></div>");
                element.parentElement.replaceChild(newparent, element);
                newparent.appendChild(element);
                element.insertAdjacentHTML("afterend", "<div class='video_right' style='width:calc(16 * var(--cscale) + var(--cscale-margin))'><iframe width='100%' height='100%' src='' frameborder='0' gesture='media'></iframe></div>");
                newparent.lastElementChild.lastElementChild.src = element.dataset.content;
				break;
			}
            return;
    }
	
	if (do_focus)
	{
		setTimeout(function () { scroll_element_to_top(element); }, 250);
	}
}

function switch_panel(id)
{
    if (id == previousButtonId)
    {
        return;
    }
	
    play_sound(1, 0.15);

	cancel_tile_tweens();

    var button = document.getElementById(id);
    var previousButton = document.getElementById(previousButtonId);

    if (previousButton !== null)
    {
        var previousInside = previousButton.getElementsByClassName("panel_button_inside").item(0);
        previousButton.style.backgroundColor = "var(--color-button-hollow-default)";
        previousButton.style.color = "var(--color-button-hollow-default)";
        previousInside.style.backgroundColor = "var(--color-background)";
    }

    previousButtonId = id;

    var inside = button.getElementsByClassName("panel_button_inside").item(0);
    button.style.backgroundColor = "var(--color-button-hollow-selected-bg)";
    button.style.color = "var(--color-button-hollow-selected-fg)";
    inside.style.backgroundColor = "var(--color-button-hollow-selected-bg)";
	include_html(document.getElementById("include_target"), button.dataset.content, update_subpage);
}

function initialize()
{
    udpate_scaling();

    window.addEventListener('resize', function () { udpate_scaling(); });

    var buttons = document.getElementsByClassName("panel_button");

    for (var i = 0; i < buttons .length; i++)
    {
        var button = buttons.item(i);

        if (button.dataset.content != null)
        {
            const buttonid = "button_id_" + i.toString();
            button.id = buttonid;
            button.style.color = "var(--color-button-hollow-default)";
            button.style.backgroundColor = "var(--color-button-hollow-default)";

            button.addEventListener('click', e => { switch_panel(buttonid.toString()); });
            button.addEventListener('mouseenter', e => { play_sound(0, 0.15); });
            bind_button_hover(button, "h3", "panel_button" + i.toString());
        }
    }

    switch_panel("button_id_0");
}

window.onload = initialize();
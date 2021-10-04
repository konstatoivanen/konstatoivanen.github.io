
var previousTileId = "";

function lerpString(content, id)
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
            ++length;
            target.innerHTML = content.substring(0, length)
        }

    }, interval);

    target.dataset.tweenTimeoutHandle = setTimeout(function ()
    {
        clearInterval(target.dataset.tweenHandle);
        target.dataset.tweenHandle = null;
        target.dataset.tweenTimeoutHandle = null;
    },
    interval * content.length + 60);
}

function bindButtonHover(button, contentTag, i)
{
    var buttonContent = button.getElementsByTagName(contentTag).item(0);
    buttonContent.id = "button_content_" + i.toString();

    const c = buttonContent.innerHTML.toString();
    const id = buttonContent.id.toString();

    button.addEventListener('mouseenter', e => { lerpString(c, id); });
}


function createElement(content)
{
    var parent = document.createElement('div');
    parent.innerHTML = content;
    return parent.firstElementChild;
}

function scrollElementToTop(element)
{
    var panel = document.documentElement;

    if (panel.clientHeight < panel.scrollHeight)
    {
        element.scrollIntoView({ alignToTop: 'true', behavior: 'smooth', block: 'start' });
    }
}

function tryUpdatePreviousTile(newId)
{
    var previousTile = document.getElementById(previousTileId);

    if (previousTile !== null)
    {
        setButtonColor(previousTile, false);
    }

    if (previousTileId === newId)
    {
        previousTileId = "";
        return false;
    }

    previousTileId = newId;
    return true;
}

function tryUpdatePreviousTileVideo(newId)
{
    var previousTile = document.getElementById(previousTileId);

    if (previousTile !== null)
    {
        previousTile.parentElement.replaceWith(previousTile);
        setButtonColor(previousTile, false);
    }

    if (previousTileId === newId)
    {
        previousTileId = "";
        return false;
    }

    previousTileId = newId;
    return true;
}

function setButtonColor(element, isActive)
{
    element.style.color = isActive ? "var(--color-button-opaque-selected-fg)" : "var(--color-button-opaque-default-fg)";
    element.style.background = isActive ? "var(--color-button-opaque-selected-bg)" : "var(--color-button-opaque-default-bg)";
}

function expandTile(id)
{
    var expandParent = document.getElementById('expandParent');

    if (expandParent !== null)
    {
        expandParent.remove();
    }

    var element = document.getElementById(id);
    setButtonColor(element, true);

    switch (element.dataset.behavior)
    {
        case "local_document":
            {
                if (!tryUpdatePreviousTile(id))
                {
                    return;
                }

                element.insertAdjacentHTML("afterend", "<div id='expandParent' class='tileExtended'><iframe width='100%' height='100%' style='height:inherit' frameborder='0' id='tileFrame' src=''></iframe></div>");
                document.getElementById('tileFrame').src = element.dataset.content;
            }
            break;
        case "local_video":
            {
                if (!tryUpdatePreviousTileVideo(id))
                {
                    return;
                }

                element.style.animationDuration = "0.0s";
                var newparent = createElement("<div style='display: inline-table; position: relative;' id='content_container'></div>");
                element.parentElement.replaceChild(newparent, element);
                newparent.appendChild(element);
                element.insertAdjacentHTML("afterend", "<div class='videoBC' style='max-width:0px;'><video height='278' loop autoplay muted><source src=''></video></div>");

                var image = newparent.lastElementChild;
                var video = newparent.lastElementChild.lastElementChild;
                video.src = element.dataset.content;
                video.addEventListener('loadeddata', function () { image.style.maxWidth = ''; }, false);
            }
            break;

        case "local_video_embed":
            {
                if (!tryUpdatePreviousTileVideo(id))
                {
                    return;
                }

                element.style.animationDuration = "0.0s";
                var newparent = createElement("<div style='display: inline-table; position: relative;' id='content_container'></div>");
                element.parentElement.replaceChild(newparent, element);
                newparent.appendChild(element);
                element.insertAdjacentHTML("afterend", "<div class='videoBC'><iframe width='556' height='278' src='' frameborder='0' gesture='media' allow='encrypted-media'></iframe></div>");
                newparent.lastElementChild.lastElementChild.src = element.dataset.content;
            }
            break;

        case "local_image":
            {
                if (!tryUpdatePreviousTile(id))
                {
                    return;
                }

                element.insertAdjacentHTML("afterend", "<div id='expandParent' class='tileExtended' style='animation-name:ClipIn_Left_TileExtendedTall'><div class='imageBC'><img src='" + element.dataset.content + "'/></div></div>");
            }
            break;
    }

    setTimeout(function () { scrollElementToTop(element); }, 250)
}

function collectTiles()
{
    var tiles = document.getElementsByClassName("tileButton");
    var panel = document.getElementsByClassName("panel").item(0);

    tiles.item(0).scrollIntoView({ alignToTop: 'false', behavior: 'auto', block: 'start', inline: 'start' });

    for (var i = 0; i < tiles.length; i++)
    {
        var tile = tiles.item(i);

        if (tile.dataset.content != null)
        {
            var tileid = "tile_id_" + i.toString();
            tile.id = tileid;
            tile.setAttribute("onclick", " expandTile('" + tileid.toString() + "')");

            bindButtonHover(tile, "h4", i);
        }
    }

    var initialId = "0";

    if (panel !== null && panel.hasAttribute("data-initialId"))
    {
        initialId = panel.getAttribute("data-initialId");
        console.log(initialId);
    }

    setTimeout(function () { expandTile("tile_id_" + initialId); }, 250)
}

window.onload = collectTiles();
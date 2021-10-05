
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
        target.innerHTML = content;
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

function collectTiles()
{
    var tiles = document.getElementsByClassName("tileButton");

    for (var i = 0; i < tiles.length; i++)
    {
        var tile = tiles.item(i);
        bindButtonHover(tile, "h4", i);
    }
}

window.onload = collectTiles();
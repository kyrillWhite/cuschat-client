export default { /* eslint-disable */
  styleChat(settings, hasSettingsProp) {
    let chatBackgroundOpacity = Math.round(settings.chatBackgroundOpacity * 255).toString(16);
    let chatBorderOpacity = Math.round(settings.chatBorderOpacity * 255).toString(16);
    let chatBorders = settings.chatBorderBorders;
    let borderLeft = !!(chatBorders & 1);
    chatBorders >>= 1;
    let borderBottom = !!(chatBorders & 1);
    chatBorders >>= 1;
    let borderRight = !!(chatBorders & 1);
    chatBorders >>= 1;
    let borderTop = !!(chatBorders & 1);

    return Object.keys(settings).length != 0 ? {
      'position': hasSettingsProp ? 'relative' : 'absolute',
      'background-color': settings.chatBackgroundColor +
        (chatBackgroundOpacity.length == 1 ? '0' : '') + chatBackgroundOpacity,
      'border-color': settings.chatBorderColor +
        (chatBorderOpacity.length == 1 ? '0' : '') + chatBorderOpacity,
      'border-radius': settings.chatBorderCornerRadius + 'px',
      'border-top-width': (borderTop ? settings.chatBorderThickness : 0) + 'px',
      'border-right-width': (borderRight ? settings.chatBorderThickness : 0) + 'px',
      'border-bottom-width': (borderBottom ? settings.chatBorderThickness : 0) + 'px',
      'border-left-width': (borderLeft ? settings.chatBorderThickness : 0) + 'px',
    } : {};
  },
  styleMessage(settings) {
    let messageBackgroundOpacity = Math.round(settings.messageBackgroundOpacity * 255).toString(16);
    let messageBorderOpacity = Math.round(settings.messageBorderOpacity * 255).toString(16);
    let messageBorders = settings.messageBorderBorders;
    let borderLeft = !!(messageBorders & 1);
    messageBorders >>= 1;
    let borderBottom = !!(messageBorders & 1);
    messageBorders >>= 1;
    let borderRight = !!(messageBorders & 1);
    messageBorders >>= 1;
    let borderTop = !!(messageBorders & 1);

    const paddings = settings.messageFormMessagePadding.split(' ');
    let paddingTop = paddings[0];
    let paddingRight = paddings[1];
    let paddingBottom = paddings[2];
    let paddingLeft = paddings[3];

    let format = ['text', 'row', 'column'][settings.messageFormFormat];
    let display = ['', 'flex', 'flex'][settings.messageFormFormat];
    let textAlign = settings.messageFormFormat == 0 ?
      ['left', 'right', 'center', 'justify'][settings.textAlign] : '';

    let appearanceTranslateX = '0%';
    let appearanceTranslateY = '0%';
    
    switch (settings.appearanceSide) {
      case 0:
        appearanceTranslateX = `-${Math.floor(100 * settings.appearanceDistance)}%`;
        break;
      case 1:
        appearanceTranslateX = `${Math.floor(100 * settings.appearanceDistance)}%`;
        break;
      default:
        appearanceTranslateX = '0%';
        break;
    }

    if (settings.appearanceSide == 2) {
      appearanceTranslateY = `${Math.floor(100 * settings.appearanceDistance)}%`;
    }

    let disappearanceTranslateX = '0%';
    let disappearanceTranslateY = '0%';
    
    switch (settings.disappearanceSide) {
      case 0:
        disappearanceTranslateX = `-${Math.floor(100 * settings.disappearanceDistance)}%`;
        break;
      case 1:
        disappearanceTranslateX = `${Math.floor(100 * settings.disappearanceDistance)}%`;
        break;
      default:
        disappearanceTranslateX = '0%';
        break;
    }
    if (settings.disappearanceSide == 2) {
      disappearanceTranslateY = `-${Math.floor(100 * settings.disappearanceDistance)}%`;
    }

    return Object.keys(settings).length != 0 ? {
      'background-color': settings.messageBackgroundColor +
        (messageBackgroundOpacity.length == 1 ? '0' : '') + messageBackgroundOpacity,
      'border-color': settings.messageBorderColor +
        (messageBorderOpacity.length == 1 ? '0' : '') + messageBorderOpacity,
      'border-radius': settings.messageBorderCornerRadius + 'px',
      'border-top-width': (borderTop ? settings.messageBorderThickness : 0) + 'px',
      'border-right-width': (borderRight ? settings.messageBorderThickness : 0) + 'px',
      'border-bottom-width': (borderBottom ? settings.messageBorderThickness : 0) + 'px',
      'border-left-width': (borderLeft ? settings.messageBorderThickness : 0) + 'px',
      'margin-left': paddingLeft + 'px',
      'margin-bottom': paddingBottom + 'px',
      'margin-right': paddingRight + 'px',
      'margin-top': paddingTop + 'px',
      'flex-direction': format,
      'display': display,
      'text-align': textAlign,
      '--appearance-translate-x': appearanceTranslateX,
      '--appearance-translate-y': appearanceTranslateY,
      '--appearance-opacity': settings.appearanceOpacity ? '0' : '1',
      '--appearance-time': `${settings.appearanceTime}ms`,
      '--disappearance-translate-x': disappearanceTranslateX,
      '--disappearance-translate-y': disappearanceTranslateY,
      '--disappearance-opacity': settings.disappearanceOpacity ? '0' : '1',
      '--disappearance-time': `${settings.disappearanceTime}ms`,
    } : {};
  },
  styleIcon(settings) {
    const paddings = settings.messageFormIconPadding.split(' ');
    let paddingTop = paddings[0];
    let paddingRight = paddings[1];
    let paddingBottom = paddings[2];
    let paddingLeft = paddings[3];

    let display = settings.authorServiceIcon ? 
      ['inline', 'block', 'block'][settings.messageFormFormat] : 'none';
    let alignSelf = ['center', 'start', 'center'][settings.messageFormFormat];

    return Object.keys(settings).length != 0 ? {
      'margin-left': paddingLeft + 'px',
      'margin-bottom': paddingBottom + 'px',
      'margin-right': paddingRight + 'px',
      'margin-top': paddingTop + 'px',
      'display': display,
      'width': settings.authorServiceIconSize + 'px',
      'align-self': alignSelf,
    } : {};
  },
  styleAuthor(settings) {
    const paddings = settings.messageFormAuthorPadding.split(' ');
    let paddingTop = paddings[0];
    let paddingRight = paddings[1];
    let paddingBottom = paddings[2];
    let paddingLeft = paddings[3];

    let display = ['inline', 'block', 'block'][settings.messageFormFormat];
    let opacity = Math.round(settings.authorOpacity * 255).toString(16);
    let fontFamily = ['Comic Neue', 'Noto Sans', 'Noto Serif', 'PT Serif', 'Roboto', 'Roboto Mono', 'Ubuntu Mono'][settings.authorFont];
    let strokeOpacity = Math.round(settings.authorStrokeOpacity * 255).toString(16);
    let strokeColor = settings.authorStrokeColor + (strokeOpacity.length == 1 ? '0' : '') + strokeOpacity;
    let strokeSize = settings.authorStroke;

    return Object.keys(settings).length != 0 ? {
      'margin-left': paddingLeft + 'px',
      'margin-bottom': paddingBottom + 'px',
      'margin-right': paddingRight + 'px',
      'margin-top': paddingTop + 'px',
      'display': display,
      'color': settings.authorColor +
        (opacity.length == 1 ? '0' : '') + opacity,
      'font-family': `\'${fontFamily}\'`,
      'font-weight': (settings.authorWeight + 1) * 100,
      'font-style': (settings.authorItalic ? 'italic' : 'normal'),
      'font-size': settings.authorSize + 'px',
      'line-height': settings.authorLineHeight + 'px',
      '-webkit-text-stroke': `${strokeSize}px ${strokeColor}`,
    } : {};
  },
  styleColon(settings) {
    let colon = settings.authorColon;

    return Object.keys(settings).length != 0 ? {
      'display': colon ? 'inline' : 'none',
    } : {};
  },
  styleText(settings) {
    const paddings = settings.messageFormTextPadding.split(' ');
    let paddingTop = paddings[0];
    let paddingRight = paddings[1];
    let paddingBottom = paddings[2];
    let paddingLeft = paddings[3];

    let display = ['inline', 'block', 'block'][settings.messageFormFormat];
    let opacity = Math.round(settings.textOpacity * 255).toString(16);
    let fontFamily = ['Comic Neue', 'Noto Sans', 'Noto Serif', 'PT Serif', 'Roboto', 'Roboto Mono', 'Ubuntu Mono'][settings.textFont];
    let strokeOpacity = Math.round(settings.textStrokeOpacity * 255).toString(16);
    let strokeColor = settings.textStrokeColor + (strokeOpacity.length == 1 ? '0' : '') + strokeOpacity;
    let strokeSize = settings.textStroke;
    let textAlign = ['left', 'right', 'center', 'justify'][settings.textAlign];

    return Object.keys(settings).length != 0 ? {
      'margin-left': paddingLeft + 'px',
      'margin-bottom': paddingBottom + 'px',
      'margin-right': paddingRight + 'px',
      'margin-top': paddingTop + 'px',
      'display': display,
      'color': settings.textColor +
        (opacity.length == 1 ? '0' : '') + opacity,
      'font-family': `\'${fontFamily}\'`,
      'font-weight': (settings.textWeight + 1) * 100,
      'font-style': (settings.textItalic ? 'italic' : 'normal'),
      'font-size': settings.textSize + 'px',
      'line-height': settings.textLineHeight + 'px',
      '-webkit-text-stroke': `${strokeSize}px ${strokeColor}`,
      'text-align': textAlign,
    } : {};
  },
  styleHeader(settings) {
    let display = ['inline', 'flex', 'flex'][settings.messageFormFormat];

    return Object.keys(settings).length != 0 ? {
      'display': display,
    } : {};
  },
  styleEmote(settings) {
    return Object.keys(settings).length != 0 ? {
      'display': 'inline',
      'width': `${settings.emotesSize}px`,
      'vertical-align': 'middle',
    } : {};
  },
}
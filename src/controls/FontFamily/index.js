/* @flow */

import React, { Component } from "react";
import PropTypes from "prop-types";
import {
  toggleCustomInlineStyle,
  getSelectionCustomInlineStyle
} from "draftjs-utils";

import LayoutComponent from "./Component";

export default class FontFamily extends Component {
  static propTypes = {
    onChange: PropTypes.func.isRequired,
    editorState: PropTypes.object,
    modalHandler: PropTypes.object,
    config: PropTypes.object,
    translations: PropTypes.object
  };

  state: Object = { expanded: undefined, currentFontFamily: undefined };

  componentWillMount(): void {
    const { editorState, modalHandler } = this.props;
    if (editorState) {
      this.setState({
        currentFontFamily: this.getCurrentFontFamily(this.props)
      });
    }
    modalHandler.registerCallBack(this.expandCollapse);
  }

  componentWillReceiveProps(properties: Object): void {
    if (
      properties.editorState &&
      this.props.editorState !== properties.editorState
    ) {
      this.setState({
        currentFontFamily: this.getCurrentFontFamily(properties)
      });
    }
  }

  componentWillUnmount(): void {
    const { modalHandler } = this.props;
    modalHandler.deregisterCallBack(this.expandCollapse);
  }

  getCurrentFontFamily = properties => {
    const { options } = this.props.config;
    const fontValue = getSelectionCustomInlineStyle(properties.editorState, [
      "FONTFAMILY"
    ]).FONTFAMILY;
    const font = options.find(opt => `fontfamily-${opt.value}` == fontValue);
    return font && font.name;
  };

  onExpandEvent: Function = (): void => {
    this.signalExpanded = !this.state.expanded;
  };

  expandCollapse: Function = (): void => {
    this.setState({
      expanded: this.signalExpanded
    });
    this.signalExpanded = false;
  };

  doExpand: Function = (): void => {
    this.setState({ expanded: true });
  };

  doCollapse: Function = (): void => {
    this.setState({ expanded: false });
  };

  toggleFontFamily: Function = (fontFamily: string) => {
    const { editorState, onChange } = this.props;
    const newState = toggleCustomInlineStyle(
      editorState,
      "fontFamily",
      fontFamily
    );
    if (newState) {
      onChange(newState);
    }
  };

  render(): Object {
    const { config, translations } = this.props;
    const { expanded, currentFontFamily } = this.state;
    const FontFamilyComponent = config.component || LayoutComponent;
    const fontFamily = currentFontFamily;
    return (
      <FontFamilyComponent
        translations={translations}
        config={config}
        currentState={{ fontFamily }}
        onChange={this.toggleFontFamily}
        expanded={expanded}
        onExpandEvent={this.onExpandEvent}
        doExpand={this.doExpand}
        doCollapse={this.doCollapse}
      />
    );
  }
}

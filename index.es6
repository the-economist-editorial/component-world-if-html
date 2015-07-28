import React from 'react';
import WorldIfApp from '@economist/component-world-if-app';
import ArticleStore from '@economist/component-articlestore';

const articleStore = new ArticleStore('/content');
export default class WorldIfHTML extends React.Component {

  static get propTypes() {
    return {
      title: React.PropTypes.string.isRequired,
      path: React.PropTypes.string.isRequired,
      scripts: React.PropTypes.object,
      styles: React.PropTypes.object,
      inlineScripts: React.PropTypes.array,
      inlineStyles: React.PropTypes.array,
    };
  }

  static get store() {
    return articleStore;
  }

  renderInlineStyles() {
    return (this.props.inlineStyles || []).map((css) => (
      <style dangerouslySetInnerHTML={{
          __html: css,
      }}/>
    ));
  }

  renderStyles() {
    return Object.keys(this.props.styles || {}).sort().map((key) => (
      <link rel="stylesheet" href={`/${this.props.styles[key]}`} data-style-name={key}/>
    ));
  }

  renderInlineScripts() {
    return (this.props.inlineScripts || []).map((js) => (
      <script dangerouslySetInnerHTML={{
          __html: js,
      }}/>
    ));
  }

  renderScripts() {
    return Object.keys(this.props.scripts || {}).sort().map((key) => (
      <script defer={true} src={`/${this.props.scripts[key]}`} data-script-name={key}></script>
    ));
  }

  renderMetaTags() {
    const id = ((this.props.path || '').match(/article\/(\d+)/) || [])[1];
    let metaTags;
    if (!id) {
      metaTags = articleStore.main;
    } else {
      metaTags = articleStore.get(id);
    }
    metaTags = ((metaTags || {}).attributes || {}).metaTags || [];
    return metaTags.map((properties) => (
      <meta {...properties}/>
    ));
  }

  render() {
    return (
      <html manifest="/application.manifest">
        <head>
          <meta charSet="utf-8"/>
          {this.renderInlineStyles()}
          <meta httpEquiv="x-ua-compatible" content="ie=edge"/>
          <meta name="viewport" content="width=device-width, initial-scale=1"/>
          <link rel="apple-touch-icon" href="assets/apple-touch-icon.png"/>
          <title>{this.props.title}</title>
          {this.renderMetaTags()}
          {this.renderStyles()}
          {this.renderScripts()}
          {this.renderInlineScripts()}
        </head>
        <body>
          <WorldIfApp path={this.props.path}/>
        </body>
      </html>
    );
  }

}

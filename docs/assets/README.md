# Documentation Assets

<div style="display: flex; align-items: center; gap: 16px; margin-bottom: 24px;">
  <div style="width: 48px; height: 48px; background: linear-gradient(135deg, #FF6B35, #F7B801); border-radius: 12px; display: flex; align-items: center; justify-content: center;">
    <span style="color: white; font-size: 24px; font-weight: bold;">🖼️</span>
  </div>
  <div>
    <h1 style="margin: 0; color: #1A1A1A;">Documentation Assets</h1>
    <p style="margin: 0; color: #666;">Images, diagrams, and visual assets for documentation</p>
  </div>
</div>

## 📁 Contents

This directory contains visual assets used throughout the CueTimer
documentation.

- **[images/](./images/)**: Screenshots, UI mockups, and reference images
- **[diagrams/](./diagrams/)**: Architecture diagrams, flowcharts, and technical
  illustrations
- **[examples/](./examples/)**: Code examples, templates, and sample files

## 🚀 Asset Guidelines

### File Naming

- Use kebab-case naming convention
- Include descriptive names for clarity
- Use appropriate file extensions (.png, .jpg, .svg, .pdf)
- Optimize file sizes for web delivery

### Image Formats

- **PNG**: Screenshots and UI elements with transparency
- **JPG**: Photographs and complex images
- **SVG**: Diagrams, icons, and scalable graphics
- **PDF**: Documents and multi-page content

### Dimensions and Quality

- **Screenshots**: 1920x1080 minimum, high DPI
- **Diagrams**: Vector format when possible, scalable
- **Icons**: 24x24, 32x32, 48x48 sizes available
- **Optimized**: Compressed for web delivery

## 📋 Asset Categories

### Images

- **UI Screenshots**: Application interface documentation
- **Component Examples**: Visual component demonstrations
- **Workflow Examples**: Step-by-step process illustrations
- **Device Mockups**: Mobile and desktop application views

### Diagrams

- **Architecture Diagrams**: System and software architecture
- **Flowcharts**: Process and workflow visualization
- **Network Diagrams**: Infrastructure and network topology
- **Database Schemas**: Data model relationships

### Examples

- **Code Templates**: Reusable code snippets
- **Configuration Files**: Example setup configurations
- **Sample Data**: Test data and example content
- **Integration Examples**: API and system integration samples

## 🔧 Asset Management

### Adding New Assets

1. **Choose appropriate folder**: Select images/, diagrams/, or examples/
2. **Use descriptive naming**: Follow kebab-case convention
3. **Optimize file size**: Compress images for web delivery
4. **Update documentation**: Reference assets in relevant documentation
5. **Test links**: Ensure asset links work correctly

### Asset Optimization

- **Images**: Use tools like TinyPNG or ImageOptim
- **SVGs**: Remove unnecessary metadata and optimize paths
- **Files**: Use appropriate compression for file types
- **Delivery**: Consider CDN or caching strategies

### Version Control

- **Commit assets**: Include assets in version control
- **Use appropriate formats**: Choose lossless for important graphics
- **Document changes**: Update documentation when assets change
- **Backup important assets**: Maintain backups of critical visuals

## 📚 Usage Guidelines

### In Documentation

```markdown
![Alt text](../assets/images/screenshot-example.png 'Screenshot description')

[Diagram View](../assets/diagrams/architecture-overview.svg)
```

### Relative Paths

Always use relative paths from the current document location:

- From docs/guide/ to assets: `../assets/`
- From docs/ to assets: `assets/`
- From nested folders: adjust path accordingly

### Alt Text and Accessibility

- **Descriptive alt text**: Provide meaningful descriptions
- **Context in text**: Explain visual content in surrounding text
- **Color contrast**: Ensure diagrams are accessible
- **Text alternatives**: Provide text descriptions for complex graphics

## 🎯 Asset Standards

### Brand Guidelines

- **CueTimer colors**: Use official brand colors
- **Typography**: Follow brand typography standards
- **Logo usage**: Use approved logo variations
- **Style consistency**: Maintain visual consistency

### Technical Standards

- **Responsive**: Assets should work on different screen sizes
- **Accessible**: Follow WCAG accessibility guidelines
- **Performant**: Optimize for fast loading
- **Compatible**: Use widely supported formats

## 📞 Asset Support

### Creating Assets

- **Design tools**: Figma, Sketch, Adobe Creative Suite
- **Screenshots**: Built-in tools, Snagit, Lightshot
- **Diagrams**: Draw.io, Mermaid, Lucidchart
- **Optimization**: TinyPNG, ImageOptim, SVGO

### Getting Help

- **Design team**: For brand-compliant graphics
- **Development team**: For technical diagrams
- **Documentation team**: For asset organization and standards
- **Community**: For contributions and improvements

---

**Last Updated:** 2025-10-26 **Maintained by:** CueTimer Documentation Team

# Contributing to CueTimer

<div style="display: flex; align-items: center; gap: 16px; margin-bottom: 24px;">
  <div style="width: 48px; height: 48px; background: linear-gradient(135deg, #FF6B35, #F7B801); border-radius: 12px; display: flex; align-items: center; justify-content: center;">
    <span style="color: white; font-size: 24px; font-weight: bold;">🤝</span>
  </div>
  <div>
    <h1 style="margin: 0; color: #1A1A1A;">Contributing Guidelines</h1>
    <p style="margin: 0; color: #666;">How to contribute to the CueTimer project</p>
  </div>
</div>

Welcome to the CueTimer contributing guide! We're excited that you're interested
in contributing to our professional event management timer platform.

## 📁 Contents

- **[Development Workflow](../development/guides/development-workflow.md)**:
  Complete development process
- **[Git Workflow](../development/guides/git-workflow-guide.md)**: Version
  control best practices
- **[Code of Conduct](./code-of-conduct.md)**: Community guidelines
- **[Pull Request Template](./pull-request-template.md)**: PR submission
  guidelines
- **[Issue Reporting](./issue-reporting.md)**: Bug reports and feature requests

## 🚀 Getting Started

### Prerequisites

- **Node.js** >= 18.0.0
- **Bun** >= 1.0.0 (recommended) or npm/yarn
- **Git** for version control
- **GitHub account** for collaboration

### Quick Setup

```bash
# Fork and clone the repository
git clone https://github.com/your-username/cue-timer.git
cd cue-timer

# Install dependencies
bun install

# Set up environment variables
cp .env.example .env.local

# Start development server
bun run dev
```

## 🎯 Types of Contributions

We welcome contributions in several areas:

### 🐛 Bug Reports

- Report bugs using our [issue template](./issue-reporting.md)
- Include reproduction steps and environment details
- Provide screenshots or screen recordings when applicable

### ✨ Feature Requests

- Suggest new features with clear use cases
- Provide implementation suggestions when possible
- Consider impact on existing users

### 📝 Documentation

- Improve existing documentation
- Add examples and tutorials
- Fix typos and formatting issues

### 💻 Code Contributions

- Bug fixes and performance improvements
- New features following our design system
- Test coverage improvements

## 🔧 Development Guidelines

### Code Standards

- Follow our [TypeScript configuration](../development/type-check/)
- Use ESLint and Prettier configurations
- Write meaningful commit messages
- Include tests for new functionality

### Design System

- Use existing shadcn/ui components when possible
- Follow our [brand guidelines](../design/branding/design-system.md)
- Ensure mobile-first responsive design
- Maintain WCAG AA accessibility standards

### Testing

- Write unit tests for new components
- Test responsive behavior on multiple devices
- Verify accessibility compliance
- Check type checking with `bun run type-check`

## 📋 Pull Request Process

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Make** your changes
4. **Test** thoroughly (`bun run quality:check`)
5. **Commit** your changes (`git commit -m 'Add amazing feature'`)
6. **Push** to your fork (`git push origin feature/amazing-feature`)
7. **Open** a Pull Request

### PR Requirements

- Clear description of changes
- Link to related issues
- Tests passing
- Type checking successful
- Documentation updated if needed

## 🎨 Design Contributions

### UI/UX Changes

- Follow our [design system](../design/branding/design-system.md)
- Use established color palette and typography
- Ensure responsive behavior
- Test accessibility compliance

### Component Development

- Use shadcn/ui as base components
- Follow established patterns
- Include proper TypeScript types
- Add comprehensive documentation

## 📚 Documentation Contributions

### Writing Guidelines

- Use clear, concise language
- Include code examples
- Add step-by-step instructions
- Follow our [naming conventions](../naming-conventions.md)

### Structure

- Organize content in appropriate folders
- Use consistent formatting
- Include navigation links
- Update table of contents

## 🏆 Recognition

Contributors are recognized in several ways:

- GitHub contributor statistics
- Release notes and changelogs
- Community spotlight in our blog
- Direct feedback from the team

## 📞 Getting Help

- **GitHub Issues**:
  [Report bugs or request features](https://github.com/your-org/cue-timer/issues)
- **Discord**: [Join our community](https://discord.gg/cuetimer)
- **Email**: dev@cuetimer.com
- **Documentation**: [Complete guide](../README.md)

## 📄 License

By contributing to CueTimer, you agree that your contributions will be licensed
under the [MIT License](../../LICENSE).

---

**Thank you for contributing to CueTimer!** Your contributions help make
professional event management more accessible and efficient for everyone.

**Last Updated:** 2025-10-26 **Maintained by:** CueTimer Development Team

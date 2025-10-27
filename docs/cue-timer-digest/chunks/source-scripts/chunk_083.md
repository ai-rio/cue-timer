# Chunk 83: source_scripts

## Metadata

- **Files**: 1
- **Size**: 25,578 characters (~6,394 tokens)
- **Categories**: source

## Files in this chunk

- `scripts/blog-create.ts`

---

## File: `scripts/blog-create.ts`

```typescript
#!/usr/bin/env bun

import chalk from 'chalk';
import { Command } from 'commander';
import inquirer from 'inquirer';
import ora from 'ora';

import { ContentCreator } from '../lib/blog-scripts/content-creator';
import CASE_STUDY_TEMPLATE, {
  CaseStudyVariables,
  createCaseStudyVariables,
} from '../lib/blog-scripts/templates/case-study';
import FEATURE_ANNOUNCE_TEMPLATE, {
  createFeatureAnnounceVariables,
  FeatureAnnounceVariables,
} from '../lib/blog-scripts/templates/feature-announce';
import PRESENTATION_TIPS_TEMPLATE, {
  createPresentationTipsVariables,
  PresentationTipsVariables,
} from '../lib/blog-scripts/templates/presentation-tips';
import TIMING_GUIDE_TEMPLATE, {
  createTimingGuideVariables,
  TimingGuideVariables,
} from '../lib/blog-scripts/templates/timing-guide';
import { CueTimerTemplate } from '../lib/blog-scripts/types';

// CLI interface for blog creation options
interface CliOptions {
  title?: string;
  template?: string;
  language?: string;
  author?: string;
  draft?: boolean;
  interactive?: boolean;
}

// Template mapping
const TEMPLATES: Record<string, CueTimerTemplate> = {
  'timing-guide': TIMING_GUIDE_TEMPLATE,
  'case-study': CASE_STUDY_TEMPLATE,
  'feature-announce': FEATURE_ANNOUNCE_TEMPLATE,
  'presentation-tips': PRESENTATION_TIPS_TEMPLATE,
};

// Template descriptions for interactive selection
const TEMPLATE_DESCRIPTIONS: Record<string, string> = {
  'timing-guide':
    'Step-by-step guides for mastering presentation timing techniques',
  'case-study': 'Success stories and real-world applications of CueTimer',
  'feature-announce':
    'Announce new features and updates to the CueTimer platform',
  'presentation-tips':
    'Practical tips and best practices for better presentations',
};

// Supported languages
const SUPPORTED_LANGUAGES = [
  { value: 'en', name: 'English' },
  { value: 'pt-br', name: 'Português (Brazil)' },
  { value: 'es', name: 'Español' },
];

// Helper function to validate template
function validateTemplate(templateName: string): CueTimerTemplate {
  const template = TEMPLATES[templateName];
  if (!template) {
    throw new Error(
      `Invalid template: ${templateName}. Available templates: ${Object.keys(TEMPLATES).join(', ')}`
    );
  }
  return template;
}

// Helper function to generate template-specific prompts
async function collectTemplateVariables(
  template: CueTimerTemplate,
  cliOptions: CliOptions
): Promise<Record<string, string | number | boolean | string[]>> {
  switch (template.id) {
    case 'timing-guide':
      return (await collectTimingGuideVariables(
        cliOptions
      )) as unknown as Record<string, string | number | boolean | string[]>;
    case 'case-study':
      return (await collectCaseStudyVariables(cliOptions)) as unknown as Record<
        string,
        string | number | boolean | string[]
      >;
    case 'feature-announce':
      return (await collectFeatureAnnounceVariables(
        cliOptions
      )) as unknown as Record<string, string | number | boolean | string[]>;
    case 'presentation-tips':
      return (await collectPresentationTipsVariables(
        cliOptions
      )) as unknown as Record<string, string | number | boolean | string[]>;
    default:
      return {};
  }
}

// Timing Guide specific prompts
async function collectTimingGuideVariables(
  cliOptions: CliOptions
): Promise<TimingGuideVariables> {
  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'title',
      message: 'What is the title of your timing guide?',
      default: cliOptions.title || 'New Timing Guide',
      when: !cliOptions.title,
      validate: (input: string) =>
        input.trim().length > 0 || 'Title is required',
    },
    {
      type: 'list',
      name: 'difficulty',
      message: 'What is the difficulty level?',
      choices: ['beginner', 'intermediate', 'advanced'],
      default: 'beginner',
    },
    {
      type: 'input',
      name: 'estimatedTime',
      message: 'Estimated time to complete (e.g., "15 minutes")',
      default: '10 minutes',
    },
    {
      type: 'input',
      name: 'targetAudience',
      message: 'Who is the target audience?',
      default: 'Presenters and public speakers',
    },
    {
      type: 'confirm',
      name: 'addSteps',
      message: 'Would you like to add step-by-step instructions?',
      default: true,
    },
    {
      type: 'input',
      name: 'introduction',
      message: 'Introduction paragraph (optional)',
      when: true,
    },
    {
      type: 'input',
      name: 'conclusion',
      message: 'Conclusion paragraph (optional)',
      when: true,
    },
  ]);

  // Collect steps if requested
  const steps = [];
  if (answers.addSteps) {
    console.log(chalk.blue("\n📝 Let's add the step-by-step instructions:"));

    let addMoreSteps = true;
    let stepIndex = 1;

    while (addMoreSteps) {
      const stepAnswers = await inquirer.prompt([
        {
          type: 'input',
          name: 'title',
          message: `Step ${stepIndex} title:`,
          validate: (input: string) =>
            input.trim().length > 0 || 'Step title is required',
        },
        {
          type: 'input',
          name: 'description',
          message: `Step ${stepIndex} description:`,
          validate: (input: string) =>
            input.trim().length > 0 || 'Step description is required',
        },
        {
          type: 'input',
          name: 'time',
          message: `Step ${stepIndex} estimated time (optional):`,
        },
        {
          type: 'confirm',
          name: 'addTips',
          message: `Add tips for step ${stepIndex}?`,
          default: false,
        },
      ]);

      const tips = [];
      if (stepAnswers.addTips) {
        let addMoreTips = true;
        let tipIndex = 1;

        while (addMoreTips) {
          const tipAnswer = await inquirer.prompt([
            {
              type: 'input',
              name: 'tip',
              message: `Tip ${tipIndex}:`,
              validate: (input: string) =>
                input.trim().length > 0 || 'Tip cannot be empty',
            },
            {
              type: 'confirm',
              name: 'addMore',
              message: 'Add another tip?',
              default: false,
            },
          ]);

          tips.push(tipAnswer.tip);
          addMoreTips = tipAnswer.addMore;
          tipIndex++;
        }
      }

      steps.push({
        title: stepAnswers.title,
        description: stepAnswers.description,
        time: stepAnswers.time,
        tips,
      });

      const continueAnswer = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'continue',
          message: 'Add another step?',
          default: false,
        },
      ]);

      addMoreSteps = continueAnswer.continue;
      stepIndex++;
    }
  }

  return createTimingGuideVariables({
    ...answers,
    steps,
  });
}

// Case Study specific prompts
async function collectCaseStudyVariables(
  cliOptions: CliOptions
): Promise<CaseStudyVariables> {
  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'title',
      message: 'What is the title of your case study?',
      default: cliOptions.title || 'New Case Study',
      when: !cliOptions.title,
      validate: (input: string) =>
        input.trim().length > 0 || 'Title is required',
    },
    {
      type: 'input',
      name: 'client',
      message: 'Client or organization name:',
      validate: (input: string) =>
        input.trim().length > 0 || 'Client name is required',
    },
    {
      type: 'input',
      name: 'industry',
      message: 'Industry sector:',
      validate: (input: string) =>
        input.trim().length > 0 || 'Industry is required',
    },
    {
      type: 'input',
      name: 'challenge',
      message: 'What was the main challenge faced?',
      validate: (input: string) =>
        input.trim().length > 0 || 'Challenge is required',
    },
    {
      type: 'input',
      name: 'solution',
      message: 'How did CueTimer solve the challenge?',
      validate: (input: string) =>
        input.trim().length > 0 || 'Solution is required',
    },
    {
      type: 'confirm',
      name: 'addResults',
      message: 'Would you like to add measurable results?',
      default: true,
    },
    {
      type: 'confirm',
      name: 'addQuotes',
      message: 'Would you like to add client testimonials?',
      default: false,
    },
  ]);

  // Collect results if requested
  const results = [];
  if (answers.addResults) {
    console.log(chalk.blue("\n📊 Let's add the measurable results:"));

    let addMoreResults = true;
    let resultIndex = 1;

    while (addMoreResults) {
      const resultAnswers = await inquirer.prompt([
        {
          type: 'input',
          name: 'metric',
          message: `Result ${resultIndex} metric name:`,
          validate: (input: string) =>
            input.trim().length > 0 || 'Metric name is required',
        },
        {
          type: 'input',
          name: 'value',
          message: `Result ${resultIndex} value:`,
          validate: (input: string) =>
            input.trim().length > 0 || 'Value is required',
        },
        {
          type: 'input',
          name: 'description',
          message: `Result ${resultIndex} description (optional):`,
        },
        {
          type: 'confirm',
          name: 'addMore',
          message: 'Add another result?',
          default: false,
        },
      ]);

      results.push({
        metric: resultAnswers.metric,
        value: resultAnswers.value,
        description: resultAnswers.description,
      });

      addMoreResults = resultAnswers.addMore;
      resultIndex++;
    }
  }

  // Collect quotes if requested
  const quotes = [];
  if (answers.addQuotes) {
    console.log(chalk.blue("\n💬 Let's add client testimonials:"));

    let addMoreQuotes = true;
    let quoteIndex = 1;

    while (addMoreQuotes) {
      const quoteAnswers = await inquirer.prompt([
        {
          type: 'input',
          name: 'text',
          message: `Quote ${quoteIndex} text:`,
          validate: (input: string) =>
            input.trim().length > 0 || 'Quote text is required',
        },
        {
          type: 'input',
          name: 'author',
          message: `Quote ${quoteIndex} author:`,
          validate: (input: string) =>
            input.trim().length > 0 || 'Author is required',
        },
        {
          type: 'input',
          name: 'role',
          message: `Quote ${quoteIndex} author role:`,
          validate: (input: string) =>
            input.trim().length > 0 || 'Role is required',
        },
        {
          type: 'input',
          name: 'company',
          message: `Quote ${quoteIndex} company (optional):`,
        },
        {
          type: 'confirm',
          name: 'addMore',
          message: 'Add another quote?',
          default: false,
        },
      ]);

      quotes.push({
        text: quoteAnswers.text,
        author: quoteAnswers.author,
        role: quoteAnswers.role,
        company: quoteAnswers.company,
      });

      addMoreQuotes = quoteAnswers.addMore;
      quoteIndex++;
    }
  }

  return createCaseStudyVariables({
    ...answers,
    results,
    quotes,
  });
}

// Feature Announcement specific prompts
async function collectFeatureAnnounceVariables(
  cliOptions: CliOptions
): Promise<FeatureAnnounceVariables> {
  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'title',
      message: 'What is the title of your feature announcement?',
      default: cliOptions.title || 'New Feature Announcement',
      when: !cliOptions.title,
      validate: (input: string) =>
        input.trim().length > 0 || 'Title is required',
    },
    {
      type: 'input',
      name: 'featureName',
      message: 'Feature name:',
      validate: (input: string) =>
        input.trim().length > 0 || 'Feature name is required',
    },
    {
      type: 'input',
      name: 'version',
      message: 'Version number:',
      default: '2.5.0',
    },
    {
      type: 'input',
      name: 'description',
      message: 'Feature description:',
      validate: (input: string) =>
        input.trim().length > 0 || 'Description is required',
    },
    {
      type: 'confirm',
      name: 'addBenefits',
      message: 'Would you like to add key benefits?',
      default: true,
    },
    {
      type: 'confirm',
      name: 'addUseCases',
      message: 'Would you like to add use cases?',
      default: true,
    },
  ]);

  // Collect benefits if requested
  const benefits = [];
  if (answers.addBenefits) {
    console.log(chalk.blue("\n🎯 Let's add the key benefits:"));

    let addMoreBenefits = true;
    let benefitIndex = 1;

    while (addMoreBenefits) {
      const benefitAnswer = await inquirer.prompt([
        {
          type: 'input',
          name: 'benefit',
          message: `Benefit ${benefitIndex}:`,
          validate: (input: string) =>
            input.trim().length > 0 || 'Benefit cannot be empty',
        },
        {
          type: 'confirm',
          name: 'addMore',
          message: 'Add another benefit?',
          default: false,
        },
      ]);

      benefits.push(benefitAnswer.benefit);
      addMoreBenefits = benefitAnswer.addMore;
      benefitIndex++;
    }
  }

  // Collect use cases if requested
  const useCases = [];
  if (answers.addUseCases) {
    console.log(chalk.blue("\n🎭 Let's add the use cases:"));

    let addMoreUseCases = true;
    let useCaseIndex = 1;

    while (addMoreUseCases) {
      const useCaseAnswer = await inquirer.prompt([
        {
          type: 'input',
          name: 'useCase',
          message: `Use case ${useCaseIndex}:`,
          validate: (input: string) =>
            input.trim().length > 0 || 'Use case cannot be empty',
        },
        {
          type: 'confirm',
          name: 'addMore',
          message: 'Add another use case?',
          default: false,
        },
      ]);

      useCases.push(useCaseAnswer.useCase);
      addMoreUseCases = useCaseAnswer.addMore;
      useCaseIndex++;
    }
  }

  return createFeatureAnnounceVariables({
    ...answers,
    benefits,
    useCases,
  });
}

// Presentation Tips specific prompts
async function collectPresentationTipsVariables(
  cliOptions: CliOptions
): Promise<PresentationTipsVariables> {
  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'title',
      message: 'What is the title of your presentation tips article?',
      default: cliOptions.title || 'New Presentation Tips Guide',
      when: !cliOptions.title,
      validate: (input: string) =>
        input.trim().length > 0 || 'Title is required',
    },
    {
      type: 'input',
      name: 'topic',
      message: 'What is the main topic/focus area?',
      validate: (input: string) =>
        input.trim().length > 0 || 'Topic is required',
    },
    {
      type: 'list',
      name: 'difficulty',
      message: 'Target skill level:',
      choices: ['beginner', 'intermediate', 'advanced'],
      default: 'beginner',
    },
    {
      type: 'confirm',
      name: 'addTips',
      message: 'Would you like to add presentation tips?',
      default: true,
    },
  ]);

  // Collect tips if requested
  const tips = [];
  if (answers.addTips) {
    console.log(chalk.blue("\n💡 Let's add the presentation tips:"));

    let addMoreTips = true;
    let tipIndex = 1;

    while (addMoreTips) {
      const tipAnswers = await inquirer.prompt([
        {
          type: 'input',
          name: 'title',
          message: `Tip ${tipIndex} title:`,
          validate: (input: string) =>
            input.trim().length > 0 || 'Tip title is required',
        },
        {
          type: 'input',
          name: 'description',
          message: `Tip ${tipIndex} description:`,
          validate: (input: string) =>
            input.trim().length > 0 || 'Tip description is required',
        },
        {
          type: 'list',
          name: 'category',
          message: `Tip ${tipIndex} category:`,
          choices: ['delivery', 'content', 'visual', 'timing', 'engagement'],
        },
        {
          type: 'input',
          name: 'example',
          message: `Tip ${tipIndex} example (optional):`,
        },
        {
          type: 'confirm',
          name: 'addMore',
          message: 'Add another tip?',
          default: false,
        },
      ]);

      tips.push({
        title: tipAnswers.title,
        description: tipAnswers.description,
        category: tipAnswers.category,
        example: tipAnswers.example,
      });

      addMoreTips = tipAnswers.addMore;
      tipIndex++;
    }
  }

  return createPresentationTipsVariables({
    ...answers,
    tips,
  });
}

// Main blog creation function
async function createBlogPost(options: CliOptions): Promise<void> {
  try {
    console.log(chalk.blue.bold('\n🚀 CueTimer Blog Creation CLI\n'));

    // Initialize content creator
    const contentCreator = new ContentCreator();

    // Interactive mode
    if (options.interactive !== false) {
      console.log(
        chalk.gray("Interactive mode enabled. Let's create your blog post!\n")
      );

      // Template selection
      const templateAnswer = await inquirer.prompt([
        {
          type: 'list',
          name: 'template',
          message: 'Which template would you like to use?',
          choices: Object.entries(TEMPLATE_DESCRIPTIONS).map(
            ([key, description]) => ({
              name: `${key.replace('-', ' ')} - ${description}`,
              value: key,
            })
          ),
          when: !options.template,
        },
      ]);

      const templateId = options.template || templateAnswer.template;
      const template = validateTemplate(templateId);

      console.log(chalk.green(`\n✅ Selected template: ${template.name}\n`));

      // Language selection
      const languageAnswer = await inquirer.prompt([
        {
          type: 'list',
          name: 'language',
          message: 'Which language?',
          choices: SUPPORTED_LANGUAGES,
          default: 'en',
          when: !options.language,
        },
      ]);

      const language = options.language || languageAnswer.language;

      // Author selection
      const authorAnswer = await inquirer.prompt([
        {
          type: 'input',
          name: 'author',
          message: 'Who is the author?',
          default: 'CueTimer Team',
          when: !options.author,
        },
      ]);

      const author = options.author || authorAnswer.author;

      // Collect template-specific variables
      console.log(
        chalk.blue(
          `\n📝 Let's collect information for your ${template.name.replace(' Template', '')}:\n`
        )
      );
      const templateVariables = await collectTemplateVariables(
        template,
        options
      );

      // Show summary
      console.log(chalk.blue('\n📋 Blog Post Summary:'));
      console.log(chalk.white(`  Title: ${templateVariables.title}`));
      console.log(chalk.white(`  Template: ${template.name}`));
      console.log(
        chalk.white(
          `  Language: ${SUPPORTED_LANGUAGES.find((l) => l.value === language)?.name}`
        )
      );
      console.log(chalk.white(`  Author: ${author}`));
      console.log(
        chalk.white(
          `  Status: ${options.draft === false ? 'Published' : 'Draft'}`
        )
      );

      const confirmAnswer = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'confirm',
          message: '\nProceed to create the blog post?',
          default: true,
        },
      ]);

      if (!confirmAnswer.confirm) {
        console.log(chalk.yellow('\n❌ Blog post creation cancelled.'));
        return;
      }

      // Create the blog post with loading spinner
      const spinner = ora('Creating your blog post...').start();

      try {
        // Add common variables
        const variables = {
          ...templateVariables,
          author,
          isDraft: options.draft !== false,
        };

        const blogPost = await contentCreator.createPost(
          template,
          variables,
          language
        );

        spinner.succeed(chalk.green('Blog post created successfully!'));

        // Show success details
        console.log(chalk.blue('\n🎉 Blog Post Created Successfully!'));
        console.log(chalk.white(`  Title: ${blogPost.title}`));
        console.log(chalk.white(`  Slug: ${blogPost.slug}`));
        console.log(chalk.white(`  Category: ${blogPost.category}`));
        console.log(chalk.white(`  Language: ${blogPost.language}`));
        console.log(chalk.white(`  Author: ${blogPost.author}`));
        console.log(
          chalk.white(`  Status: ${blogPost.isDraft ? 'Draft' : 'Published'}`)
        );
        console.log(chalk.white(`  Read Time: ${blogPost.readTime} minutes`));

        const year = new Date().getFullYear();
        const month = String(new Date().getMonth() + 1).padStart(2, '0');
        const filePath = `content/blog/${year}/${month}/${blogPost.slug}.mdx`;

        console.log(chalk.green('\n📁 File Location:'));
        console.log(chalk.cyan(`  ${filePath}`));

        console.log(chalk.blue('\n📝 Next Steps:'));
        console.log(chalk.white('  1. Review and edit the generated content'));
        console.log(chalk.white('  2. Add custom images and media if needed'));
        console.log(
          chalk.white('  3. Test the post in your development environment')
        );
        console.log(chalk.white('  4. Publish when ready'));
      } catch (error) {
        spinner.fail(chalk.red('Failed to create blog post'));
        throw error;
      }
    } else {
      // Non-interactive mode
      if (!options.template) {
        throw new Error('Template is required in non-interactive mode');
      }

      const template = validateTemplate(options.template);
      const language = options.language || 'en';
      const author = options.author || 'CueTimer Team';

      console.log(
        chalk.blue(`\n📝 Creating blog post with template: ${template.name}`)
      );

      const spinner = ora('Creating blog post...').start();

      try {
        // Create with default template variables
        const defaultVariables = createDefaultVariables(template, options);
        const variables = {
          ...defaultVariables,
          author,
          isDraft: options.draft !== false,
        };

        const blogPost = await contentCreator.createPost(
          template,
          variables,
          language
        );

        spinner.succeed(chalk.green('Blog post created successfully!'));

        console.log(chalk.green('\n✅ Blog Post Created:'));
        console.log(chalk.white(`  Title: ${blogPost.title}`));
        console.log(chalk.white(`  Slug: ${blogPost.slug}`));
        console.log(
          chalk.white(
            `  File: content/blog/${new Date().getFullYear()}/${String(new Date().getMonth() + 1).padStart(2, '0')}/${blogPost.slug}.mdx`
          )
        );
      } catch (error) {
        spinner.fail(chalk.red('Failed to create blog post'));
        throw error;
      }
    }
  } catch (error) {
    console.error(chalk.red('\n❌ Error creating blog post:'));
    console.error(
      chalk.red(error instanceof Error ? error.message : String(error))
    );
    process.exit(1);
  }
}

// Helper function to create default variables for non-interactive mode
function createDefaultVariables(
  template: CueTimerTemplate,
  options: CliOptions
): Record<string, string | number | boolean | string[]> {
  const baseVariables = {
    title: options.title || `New ${template.name.replace(' Template', '')}`,
  };

  switch (template.id) {
    case 'timing-guide':
      return createTimingGuideVariables(baseVariables) as unknown as Record<
        string,
        string | number | boolean | string[]
      >;
    case 'case-study':
      return createCaseStudyVariables(baseVariables) as unknown as Record<
        string,
        string | number | boolean | string[]
      >;
    case 'feature-announce':
      return createFeatureAnnounceVariables(baseVariables) as unknown as Record<
        string,
        string | number | boolean | string[]
      >;
    case 'presentation-tips':
      return createPresentationTipsVariables(
        baseVariables
      ) as unknown as Record<string, string | number | boolean | string[]>;
    default:
      return baseVariables;
  }
}

// Setup CLI program
const program = new Command();

program
  .name('blog-create')
  .description('Create a new blog post using CueTimer templates')
  .version('1.0.0');

program
  .option('--title <title>', 'Blog post title')
  .option(
    '--template <template>',
    `Template type (${Object.keys(TEMPLATES).join(', ')})`
  )
  .option('--language <language>', 'Language code (en, pt-br, es)', 'en')
  .option('--author <author>', 'Author name', 'CueTimer Team')
  .option('--draft', 'Create as draft (default: true)')
  .option('--no-draft', 'Create as published')
  .option('--interactive', 'Use interactive prompts (default: true)')
  .option('--no-interactive', 'Skip prompts, use only CLI args')
  .action(createBlogPost);

// Help command
program
  .command('help-templates')
  .description('Show available templates and their descriptions')
  .action(() => {
    console.log(chalk.blue.bold('\n📋 Available Templates:\n'));

    Object.entries(TEMPLATE_DESCRIPTIONS).forEach(([key, description]) => {
      console.log(chalk.green(`  ${key.replace('-', ' ')}`));
      console.log(chalk.gray(`    ${description}\n`));
    });

    console.log(chalk.blue('🌐 Supported Languages:\n'));
    SUPPORTED_LANGUAGES.forEach((lang) => {
      console.log(chalk.white(`  ${lang.value} - ${lang.name}`));
    });
    console.log();
  });

// Parse command line arguments
program.parse();

// Export for testing
export { createBlogPost };
export type { CliOptions };
```

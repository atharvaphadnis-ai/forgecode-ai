export const WORKSPACE_TOOLS = {
  read_file: {
    name: 'read_file',
    description: 'Read the contents of a file from the workspace',
    parameters: {
      path: { type: 'string', description: 'Path to the file' },
    },
  },
  write_file: {
    name: 'write_file',
    description: 'Write content to a file in the workspace',
    parameters: {
      path: { type: 'string', description: 'Path to the file' },
      content: { type: 'string', description: 'File content' },
    },
  },
  create_file: {
    name: 'create_file',
    description: 'Create a new file in the workspace',
    parameters: {
      path: { type: 'string', description: 'Path to the new file' },
      content: { type: 'string', description: 'Initial file content' },
    },
  },
  delete_file: {
    name: 'delete_file',
    description: 'Delete a file from the workspace',
    parameters: {
      path: { type: 'string', description: 'Path to the file' },
    },
  },
  create_directory: {
    name: 'create_directory',
    description: 'Create a new directory in the workspace',
    parameters: {
      path: { type: 'string', description: 'Path to the new directory' },
    },
  },
  list_directory: {
    name: 'list_directory',
    description: 'List files and directories in a path',
    parameters: {
      path: { type: 'string', description: 'Directory path' },
    },
  },
  search_files: {
    name: 'search_files',
    description: 'Search for files by name pattern',
    parameters: {
      pattern: { type: 'string', description: 'File name pattern to search' },
    },
  },
  find_in_files: {
    name: 'find_in_files',
    description: 'Search for text content within files',
    parameters: {
      pattern: { type: 'string', description: 'Text to search for' },
    },
  },
};

export const TERMINAL_TOOLS = {
  run_command: {
    name: 'run_command',
    description: 'Execute a terminal command in the workspace',
    parameters: {
      command: { type: 'string', description: 'Command to execute' },
    },
  },
  get_process_output: {
    name: 'get_process_output',
    description: 'Get output from a running process',
    parameters: {
      processId: { type: 'string', description: 'Process ID' },
    },
  },
};

export const PROJECT_TOOLS = {
  detect_project: {
    name: 'detect_project',
    description: 'Detect project type and configuration',
    parameters: {},
  },
  inspect_project: {
    name: 'inspect_project',
    description: 'Get detailed project information',
    parameters: {},
  },
  install_dependencies: {
    name: 'install_dependencies',
    description: 'Install project dependencies',
    parameters: {},
  },
  run_build: {
    name: 'run_build',
    description: 'Run the project build command',
    parameters: {},
  },
  run_tests: {
    name: 'run_tests',
    description: 'Run project tests',
    parameters: {},
  },
};

export const GIT_TOOLS = {
  git_status: {
    name: 'git_status',
    description: 'Get Git repository status',
    parameters: {},
  },
  git_diff: {
    name: 'git_diff',
    description: 'Get Git diff for changed files',
    parameters: {},
  },
  git_commit: {
    name: 'git_commit',
    description: 'Create a Git commit',
    parameters: {
      message: { type: 'string', description: 'Commit message' },
    },
  },
};

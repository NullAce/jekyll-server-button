# Git Repository Setup Script

This script helps you set up the repository for publication to GitHub.

## Steps to publish:

1. **Initialize Git Repository** (if not already done):
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   ```

2. **Create GitHub Repository**:
   - Go to GitHub and create a new repository named `jekyll-server-button`
   - Don't initialize with README (we already have one)

3. **Link to GitHub**:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/jekyll-server-button.git
   git branch -M main
   git push -u origin main
   ```

4. **Update package.json**:
   - Replace `your-username` with your actual GitHub username
   - Replace `your-publisher-name` with your VS Code Marketplace publisher name

5. **For VS Code Marketplace Publishing**:
   - Get a Personal Access Token from Azure DevOps
   - Install vsce: `npm install -g @vscode/vsce`
   - Publish: `vsce publish`

## Before Publishing Checklist:

- [ ] Update version in package.json
- [ ] Update README.md with screenshots
- [ ] Test extension thoroughly
- [ ] Update CHANGELOG.md
- [ ] Check all URLs in package.json point to your repository
- [ ] Ensure you have a VS Code Marketplace publisher account

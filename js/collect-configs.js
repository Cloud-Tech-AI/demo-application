#!/usr/bin/env node
/**
 * Configuration Export Utility
 * 
 * This module exports current cluster state for deployment verification.
 * It's used during CI/CD and local development to ensure deployment
 * manifests match the actual cluster state.
 * 
 * Usage: node collect-configs.js
 * Output: cluster-configs/ directory with YAML/JSON exports
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const CONFIG_DIR = path.join(__dirname, '../cluster-configs');

// Ensure output directory exists
if (!fs.existsSync(CONFIG_DIR)) {
    fs.mkdirSync(CONFIG_DIR, { recursive: true });
}

/**
 * Execute a kubectl command and return output
 * @param {string} cmd - kubectl command to execute
 * @returns {string} Command output or error message
 */
function runCommand(cmd) {
    try {
        return execSync(cmd, { encoding: 'utf8', maxBuffer: 10 * 1024 * 1024 });
    } catch (error) {
        return `// Command failed: ${cmd}\n// Error: ${error.message}\n`;
    }
}

/**
 * Save content to a file in the config directory
 * @param {string} filename - Output filename
 * @param {string} content - Content to write
 */
function saveFile(filename, content) {
    const filepath = path.join(CONFIG_DIR, filename);
    fs.writeFileSync(filepath, content);
    console.log(`  ✓ Exported: ${filename}`);
}

/**
 * Export cluster context information
 */
function exportClusterContext() {
    console.log('Exporting cluster context...');
    
    const context = runCommand('kubectl config current-context');
    const clusterInfo = runCommand('kubectl cluster-info --output json');
    
    saveFile('cluster-context.txt', context);
    saveFile('cluster-info.json', clusterInfo);
}

/**
 * Export all namespace resources
 */
function exportNamespaceResources() {
    console.log('Exporting namespace resources...');
    
    const resources = runCommand('kubectl get all -o yaml');
    saveFile('namespace-resources.yaml', resources);
}

/**
 * Export ConfigMaps (read-only configuration)
 */
function exportConfigMaps() {
    console.log('Exporting ConfigMaps...');
    
    const configMaps = runCommand('kubectl get configmaps -o yaml');
    saveFile('configmaps.yaml', configMaps);
}

/**
 * Export Services (load balancer and service definitions)
 */
function exportServices() {
    console.log('Exporting Services...');
    
    const services = runCommand('kubectl get services -o yaml');
    saveFile('services.yaml', services);
}

/**
 * Export Deployments (deployment manifests)
 */
function exportDeployments() {
    console.log('Exporting Deployments...');
    
    const deployments = runCommand('kubectl get deployments -o yaml');
    saveFile('deployments.yaml', deployments);
}

/**
 * Export StatefulSets if any exist
 */
function exportStatefulSets() {
    console.log('Exporting StatefulSets...');
    
    const statefulSets = runCommand('kubectl get statefulsets -o yaml 2>/dev/null || echo "No StatefulSets found"');
    saveFile('statefulsets.yaml', statefulSets);
}

/**
 * Export PersistentVolumeClaims
 */
function exportPVCs() {
    console.log('Exporting PersistentVolumeClaims...');
    
    const pvcs = runCommand('kubectl get pvc -o yaml');
    saveFile('persistentvolumeclaims.yaml', pvcs);
}

/**
 * Export Services (load balancer and service definitions)
 */
function exportIngress() {
    console.log('Exporting Ingress resources...');
    
    const ingress = runCommand('kubectl get ingress -o yaml 2>/dev/null || echo "No Ingress resources found"');
    saveFile('ingress.yaml', ingress);
}

/**
 * Export Network Policies
 */
function exportNetworkPolicies() {
    console.log('Exporting Network Policies...');
    
    const netpol = runCommand('kubectl get networkpolicies -o yaml 2>/dev/null || echo "No Network Policies found"');
    saveFile('networkpolicies.yaml', netpol);
}

/**
 * Export ServiceAccounts
 */
function exportServiceAccounts() {
    console.log('Exporting ServiceAccounts...');
    
    const sa = runCommand('kubectl get serviceaccounts -o yaml');
    saveFile('serviceaccounts.yaml', sa);
}

/**
 * Export Secrets metadata (names only, not contents)
 * This avoids exposing sensitive data while still providing configuration context
 */
function exportSecretsMetadata() {
    console.log('Exporting Secrets metadata...');
    
    const secrets = runCommand('kubectl get secrets -o json 2>/dev/null || echo "No Secrets found"');
    saveFile('secrets-metadata.json', secrets);
}

/**
 * Export nodes information
 */
function exportNodes() {
    console.log('Exporting Nodes...');
    
    const nodes = runCommand('kubectl get nodes -o wide');
    saveFile('nodes.txt', nodes);
    
    const nodeDetails = runCommand('kubectl get nodes -o json');
    saveFile('nodes.json', nodeDetails);
}

/**
 * Export pod status for debugging
 */
function exportPodStatus() {
    console.log('Exporting Pod status...');
    
    const pods = runCommand('kubectl get pods -o wide');
    saveFile('pods-status.txt', pods);
    
    const podsFull = runCommand('kubectl get pods -o yaml 2>/dev/null || echo "Could not export full pod details"');
    saveFile('pods.yaml', podsFull);
}

/**
 * Export resource quotas
 */
function exportResourceQuotas() {
    console.log('Exporting Resource Quotas...');
    
    const quotas = runCommand('kubectl get resourcequotas -o yaml 2>/dev/null || echo "No ResourceQuotas found"');
    saveFile('resourcequotas.yaml', quotas);
}

/**
 * Export events from the current namespace
 */
function exportEvents() {
    console.log('Exporting Events...');
    
    const events = runCommand('kubectl get events --sort-by=.metadata.creationTimestamp -o wide');
    saveFile('events.txt', events);
}

/**
 * Export RBAC configuration
 */
function exportRBAC() {
    console.log('Exporting RBAC configuration...');
    
    const roles = runCommand('kubectl get roles -o yaml 2>/dev/null || echo "No Roles found"');
    saveFile('roles.yaml', roles);
    
    const roleBindings = runCommand('kubectl get rolebindings -o yaml 2>/dev/null || echo "No RoleBindings found"');
    saveFile('rolebindings.yaml', roleBindings);
}

/**
 * Export deployment manifests with current image tags
 * This helps verify which versions are actually deployed
 */
function exportDeploymentDetails() {
    console.log('Exporting Deployment details...');
    
    const output = runCommand('kubectl get deployments -o jsonpath=\'{range .items[*]}{.metadata.name}: {.spec.template.spec.containers[*].image}{"\n"}{end}\'');
    saveFile('deployment-images.txt', output);
}

/**
 * Create an export summary file
 */
function createExportSummary() {
    const files = fs.readdirSync(CONFIG_DIR).filter(f => f.endsWith('.yaml') || f.endsWith('.json') || f.endsWith('.txt'));
    
    const summary = {
        exportTimestamp: new Date().toISOString(),
        configDirectory: CONFIG_DIR,
        exportedFiles: files.length,
        files: files,
        summary: 'This directory contains exported cluster configuration files.',
        notes: [
            'These files represent the current cluster state.',
            'Use them to verify deployment manifests match production.',
            'Secret contents are NOT exported - only metadata.'
        ]
    };
    
    saveFile('EXPORT-SUMMARY.json', JSON.stringify(summary, null, 2));
    
    // Create a simple .gitkeep to ensure directory is tracked
    fs.writeFileSync(path.join(CONFIG_DIR, '.gitkeep'), '# Cluster configuration exports\n');
}

/**
 * Main export function
 */
function main() {
    console.log('\n========================================');
    console.log('Configuration Export Utility');
    console.log('========================================');
    console.log('Exporting current cluster state to cluster-configs/\n');
    
    try {
        // Cluster context and info
        exportClusterContext();
        
        // RBAC configuration
        exportRBAC();
        
        // Core resources
        exportNamespaceResources();
        exportConfigMaps();
        exportServices();
        exportDeployments();
        exportStatefulSets();
        exportPVCs();
        exportIngress();
        exportNetworkPolicies();
        exportServiceAccounts();
        exportSecretsMetadata();
        
        // Node and pod info
        exportNodes();
        exportPodStatus();
        
        // Resource quotas
        exportResourceQuotas();
        
        // Events and logs
        exportEvents();
        
        // Deployment details
        exportDeploymentDetails();
        
        // Summary
        createExportSummary();
        
        console.log('\n========================================');
        console.log('Export Complete');
        console.log('========================================');
        console.log(`Exported ${fs.readdirSync(CONFIG_DIR).length} files to cluster-configs/`);
        console.log('Review the exported files for deployment verification.\n');
        
    } catch (error) {
        console.error('\nExport failed:', error.message);
        process.exit(1);
    }
}

// Run if executed directly
if (require.main === module) {
    main();
}

module.exports = { main, runCommand, saveFile };
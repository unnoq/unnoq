import fs from 'node:fs'
import path from 'node:path'

interface Dependency {
  name: string
  version: string
  type: 'dependencies' | 'peerDependencies' | 'optionalDependencies'
}

export function loadExternal(pkgPath: string): string[] {
  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'))

  const dependencies = loadDependenciesRecursively(pkgPath)

  const devDependencies = Object.keys(pkg.devDependencies ?? {})

  return dependencies
    .filter((dep) => {
      if (dep.type === 'dependencies') {
        return true
      }

      if (devDependencies.includes(dep.name)) {
        return false
      }

      return true
    })
    .map(({ name }) => name)
}

function loadDependenciesRecursively(pkgPath: string, dep = 0): Dependency[] {
  if (dep > 10) {
    return []
  }

  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'))

  const packages: Dependency[] = ([] as Dependency[])
    .concat(
      Object.entries(pkg.dependencies ?? {}).map(([name, version]) => ({
        name,
        version: version as string,
        type: 'dependencies' as const,
      })),
    )
    .concat(
      Object.entries(pkg.peerDependencies ?? {}).map(([name, version]) => ({
        name,
        version: version as string,
        type: 'peerDependencies' as const,
      })),
    )
    .concat(
      Object.entries(pkg.optionalDependencies ?? {}).map(([name, version]) => ({
        name,
        version: version as string,
        type: 'optionalDependencies' as const,
      })),
    )

  const linkedDependencies = packages.filter((pkg) => isLinkedDependency(pkg))

  for (const pkg of linkedDependencies) {
    const linkPkgPath = path.resolve(
      path.dirname(pkgPath),
      `node_modules/${pkg.name}/package.json`,
    )

    packages.push(...loadDependenciesRecursively(linkPkgPath, dep + 1))
  }

  return packages.filter((pkg) => {
    if (pkg.type === 'dependencies') {
      return true
    }

    if (
      packages.find((p) => p.name === pkg.name && p.type === 'dependencies')
    ) {
      return false
    }

    return true
  })
}

function isLinkedDependency(pkg: Dependency): boolean {
  return ['workspace:', 'file:'].some((prefix) =>
    pkg.version.startsWith(prefix),
  )
}

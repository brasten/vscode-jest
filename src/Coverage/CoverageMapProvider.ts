import { createSourceMapStore, MapStore } from 'istanbul-lib-source-maps'
import { createCoverageMap, CoverageMap } from 'istanbul-lib-coverage'

export enum CoverageUpdateStrategy {
  Replace = 'Replace',
  Merge = 'Merge',
}

export class CoverageMapProvider {
  static readonly defaultUpdateStrategy = CoverageUpdateStrategy.Replace

  private _updateStrategy: CoverageUpdateStrategy
  private mapStore: MapStore

  /**
   * Transformed coverage map
   */
  private _map: CoverageMap

  constructor(coverageUpdateStrategy: CoverageUpdateStrategy = CoverageMapProvider.defaultUpdateStrategy) {
    this._updateStrategy = coverageUpdateStrategy
    this._map = createCoverageMap()
    this.mapStore = createSourceMapStore()
  }

  get updateStrategy(): CoverageUpdateStrategy {
    return this._updateStrategy
  }

  get map(): CoverageMap {
    return this._map
  }

  update(obj: CoverageMap | Object) {
    const map = createCoverageMap(obj)
    const transformed = this.mapStore.transformCoverage(map)

    switch (this.updateStrategy) {
      case CoverageUpdateStrategy.Merge:
        this._map.merge(transformed.map)
        break
      default:
        this._map = transformed.map
        break
    }
  }

  public getFileCoverage(filePath: string) {
    return this._map.data[filePath]
  }
}

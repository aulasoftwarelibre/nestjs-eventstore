import { Injectable } from '@nestjs/common'
import { ModuleRef } from '@nestjs/core'
import { IEventHandler } from '@nestjs/cqrs'
import { EVENTS_HANDLER_METADATA } from '@nestjs/cqrs/dist/decorators/constants'
import { ExplorerService } from '@nestjs/cqrs/dist/services/explorer.service'

@Injectable()
export class ProjectionsService {
  constructor(
    private readonly explorer: ExplorerService,
    private readonly moduleReference: ModuleRef,
  ) {}

  public eventHandlers(): Record<string, IEventHandler[]> {
    return this.explorer.explore().events.reduce((previous, handler) => {
      const instance = this.moduleReference.get(handler, { strict: false })

      if (!instance) {
        return previous
      }

      const eventsNames = Reflect.getMetadata(EVENTS_HANDLER_METADATA, handler)

      eventsNames.map((event) => {
        const key = event.name

        previous[key] = previous[key]
          ? [...previous[key], instance]
          : [instance]
      })

      return previous
    }, {})
  }
}

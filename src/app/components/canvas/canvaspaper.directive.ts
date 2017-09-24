import { AfterViewInit, Directive, ElementRef, Input, OnDestroy } from '@angular/core';
import { ActionSource } from 'app/model/actionmode';
import { VectorLayer } from 'app/model/layers';
import { Path } from 'app/model/paths';
import { SvgLoader } from 'app/scripts/import';
import { DestroyableMixin } from 'app/scripts/mixins';
import { Paper } from 'app/scripts/paper';
import { PaperService } from 'app/services';
import { State, Store } from 'app/store';
import { SetVectorLayer } from 'app/store/layers/actions';
import { getVectorLayer } from 'app/store/layers/selectors';
import * as $ from 'jquery';

import { CanvasLayoutMixin } from './CanvasLayoutMixin';

@Directive({ selector: '[appCanvasPaper]' })
export class CanvasPaperDirective extends CanvasLayoutMixin(DestroyableMixin())
  implements AfterViewInit, OnDestroy {
  @Input() actionSource: ActionSource;

  private readonly $canvas: JQuery<HTMLCanvasElement>;

  constructor(
    elementRef: ElementRef,
    private readonly ps: PaperService,
    private readonly store: Store<State>,
  ) {
    super();
    this.$canvas = $(elementRef.nativeElement) as JQuery<HTMLCanvasElement>;
  }

  ngAfterViewInit() {
    Paper.initialize(this.$canvas.get(0), this.ps);

    // TODO: remove this debug code
    const jsonObj = JSON.parse(`{
      "id": "1",
      "name": "demo",
      "type": "vector",
      "width": "48",
      "height": "48",
      "children": [
        {
          "id": "3",
          "name": "group",
          "type": "group",
          "pivotX": "12",
          "pivotY": "12",
          "scaleX": "1",
          "scaleY": "1",
          "children": [
            {
              "id": "4",
              "name": "orange",
              "type": "path",
              "pathData": "M 1 1 h 12 v 12 h -12 v -12",
              "fillColor": "#ffa500"
            },
            {
              "id": "5",
              "name": "blue",
              "type": "path",
              "pathData": "M 6 24 h 12 v 12 h -12 v -12",
              "fillColor": "#0000ff"
            }
          ]
        }
      ]
    }`);
    // TODO: remove this debug code
    this.store.dispatch(new SetVectorLayer(new VectorLayer(jsonObj)));
  }

  ngOnDestroy() {
    // TODO: support the ability to detach paper.js features? (i.e. Paper.detach(canvas))
  }

  // @Override
  protected onDimensionsChanged() {
    const { w, h } = this.getViewport();
    const scale = this.cssScale;
    this.$canvas.css({ width: w * scale, height: h * scale });
    Paper.updateDimensions(w, h, w * scale, h * scale);
  }
}
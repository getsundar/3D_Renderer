import {
  Component,
  ViewChild,
  ElementRef,
  Input,
  OnInit
} from '@angular/core';
import * as THREE from 'three';
declare var require: any;
import OrbitControls from 'three-orbitcontrols';
import GLTFLoader from 'three-gltf-loader';

@Component({
  selector: 'app-renderer-component',
  templateUrl: './renderer-component.component.html',
  styleUrls: ['./renderer-component.component.css']
})
export class RendererComponentComponent implements OnInit {
  @ViewChild('rendererContainer') rendererContainer: ElementRef;
  @ViewChild('wireframeButton') wireframeButton: ElementRef;
  @Input() modelPath: any;
  @Input() rendererHeight: any;
  @Input() rendererWidth: any;
  @Input() cameraPosition: any;
  @Input() controlsPosition: any;
  @Input() showAxishelper: boolean;
  @Input() axisHelperSize: any;
  renderer = new THREE.WebGLRenderer();
  scene;
  camera;
  mesh;
  controls;
  light;
  raycaster;
  mouse;
  sprite;
  modelLoaded;
  constructor() {
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x383838);
    this.light = new THREE.HemisphereLight(0xbbbbff, 0x444422);
    this.light.position.set(0, 1, 0);
    this.scene.add(this.light);
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.gammaOutput = true;
  }

  ngOnInit() {
    this.loadModel();
    this.addListeners();
    this.addAxisHelper();
    this.setRenderer();
    this.setCamera();
    this.setControls();
    this.animate();
  }
  setCamera() {
    this.camera = new THREE.PerspectiveCamera(60, this.rendererContainer.nativeElement.firstChild.clientWidth /
      this.rendererContainer.nativeElement.firstChild.clientHeight, 1, 80000);
    this.camera.position.set(this.cameraPosition[0], this.cameraPosition[1], this.cameraPosition[2]);
  }
  setControls() {
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.target.set(this.controlsPosition[0], this.controlsPosition[1], this.controlsPosition[2]);
    this.controls.update();
  }
  setRenderer() {
    this.renderer.setSize(this.rendererWidth, this.rendererHeight);
    this.rendererContainer.nativeElement.appendChild(this.renderer.domElement);
  }
  addListeners() {
    window.addEventListener('resize', () => {
      this.resetRenderer();
    });
  }
  loadModel() {
    const loader = new GLTFLoader();
    loader.load(this.modelPath, (gltf) => {
      this.scene.add(gltf.scene);
      this.modelLoaded = gltf.scene;
    }, undefined, function (e) {
      console.error(e);
    });
  }
  resetRenderer() {
    this.camera.aspect = this.rendererContainer.nativeElement.firstChild.clientWidth /
      this.rendererContainer.nativeElement.firstChild.clientHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight - 50);
  }
  animate() {
    window.requestAnimationFrame(() => this.animate());
    this.renderer.render(this.scene, this.camera);
  }
  addAxisHelper() {
    const axesHelper = new THREE.AxesHelper(this.axisHelperSize);
    if (this.showAxishelper) {
      this.scene.add(axesHelper);
    }
  }
}

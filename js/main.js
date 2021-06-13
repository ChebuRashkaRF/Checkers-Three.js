function main() {

    //  Холст
    const canvas = document.querySelector('#c');
    const renderer = new THREE.WebGLRenderer({
        canvas
    });

    /*
        Функция, которая проверяет, совпадает ли размер рисованного буфера
        с размером, на котором он отображается, и, если это так,
        зададим холсту этот размер.
    */
    function resizeRendererToDisplaySize(renderer) {
        const canvas = renderer.domElement;
        const pixelRatio = window.devicePixelRatio;
        const width = canvas.clientWidth * pixelRatio | 0;
        const height = canvas.clientHeight * pixelRatio | 0;
        const needResize = canvas.width !== width || canvas.height !== height;
        if (needResize) {
            renderer.setSize(width, height, false);
        }
        return needResize;
    }

    // Сцена
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('rgb(245, 188, 20)');


    // Параметры камеры
    const fov = 75;
    const aspect = 2; // the canvas default
    const near = 0.1;
    const far = 1000;
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.up.set(0, 0, 1);
    camera.position.z = 15;


    /*
        OrbitControls позволит пользователю вращать или
        поворачивать камеру вокруг некоторой точки.
    */
    const controls = new THREE.OrbitControls(camera, renderer.domElement);


    // Поля доски и шашки
    const fields = new Map();
    const checkers_white = new Map();
    const checkers_black = new Map();

    // геометрия поля доски
    const width = 2.0;
    const height = 2.0;
    const geometry = new THREE.PlaneGeometry(width, height);

    // Координаты первого поля
    let x = -8;
    let y = 8;
    let flag = true;


    // Свет
    {
        const color = 0xFFFFFF;
        const intensity = 1;
        const light = new THREE.DirectionalLight(color, intensity);
        light.position.set(0, 0, 10);
        scene.add(light);
    }

    // Геометрия шашек
    const radiusTop = 0.5;
    const radiusBottom = 0.8;
    const height_checkers = 0.4;
    const radialSegments = 20;
    const geometry_checkers = new THREE.CylinderGeometry(
        radiusTop, radiusBottom, height_checkers, radialSegments);


    // Функция задает цвет материалу и положение шашек
    function paintCheckers(geometry_checkers, color, x, y) {
        const material_checkers = new THREE.MeshPhongMaterial();
        material_checkers.color.set(color);

        const checkers = new THREE.Mesh(geometry_checkers, material_checkers);
        checkers.rotation.y = 90 * (Math.PI / 180);
        checkers.rotation.z = 90 * (Math.PI / 180);
        checkers.position.set(x, y, height_checkers / 2);
        scene.add(checkers);
        return checkers;
    }


    // Функция задает цвет материалу и положение полю
    function paintField(geometry, color, x, y) {
        const material = new THREE.MeshBasicMaterial({
            side: THREE.DoubleSide
        });
        material.color.set(color);

        const field = new THREE.Mesh(geometry, material);
        field.position.x = x;
        field.position.y = y;
        scene.add(field);
        fields.set(field, [x, y]);
    }


    // Создание полей и шашек
    for (let y = 8; y > -8; y -= 2) {
        for (let x = -8; x < 8; x += 2) {
            if (x == -8) flag = !flag;
            if (flag) {
                paintField(geometry, 0x404040, x, y);
            } else {
                paintField(geometry, 0xFFFFFF, x, y);
                if (checkers_white.size < 12) {
                    checkers = paintCheckers(geometry_checkers, 0xFFFFFF, x, y);
                    checkers_white.set(checkers, [x, y]);
                }
                if (y <= -2 && checkers_black.size < 12) {
                    checkers = paintCheckers(geometry_checkers, 0x000000, x, y);
                    checkers_black.set(checkers, [x, y]);
                }
            }
            flag = !flag;
        }
    }


    // Функция отрисовки
    function animate() {
        if (resizeRendererToDisplaySize(renderer)) {
            const canvas = renderer.domElement;
            camera.aspect = canvas.clientWidth / canvas.clientHeight;
            camera.updateProjectionMatrix();
        }


        requestAnimationFrame(animate);
        renderer.render(scene, camera);
    }

    animate();

}

main();

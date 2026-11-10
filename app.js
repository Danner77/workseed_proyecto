document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Control del Menú Desplegable Lateral
    const menuToggle = document.getElementById('menu-toggle');
    const closeBtn = document.getElementById('close-btn');
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('overlay');

    menuToggle.addEventListener('click', () => {
        sidebar.classList.add('open');
        overlay.classList.active ? null : overlay.classList.add('active');
    });

    const hideSidebar = () => {
        sidebar.classList.remove('open');
        overlay.classList.remove('active');
    };

    closeBtn.addEventListener('click', hideSidebar);
    overlay.addEventListener('click', hideSidebar);

    // 2. Mock Data basada en el Modelo Entidad-Relación

    // Entidad: Empleado
    const empleadoActual = {
        ID_Empleado: 101,
        Nombre_usuario: "juan_dev",
        Correo_electronico: "juan.perez@workseed.io",
        Datos_generales: {
            nombres: "Juan Sebastián",
            apellidos: "Pérez",
            edad: 26,
            fecha_nacimiento: "1998-05-14"
        }
    };

    // Entidad: Hoja de vida (FK implícita hacia Empleado)
    const hojaDeVida = {
        Experiencia_laboral: "3 años desarrollador Frontend Web",
        Informacion_academica: "Ingeniero de Sistemas",
        Datos_caracteristicos: "JavaScript, HTML5, CSS3, UI/UX"
    };

    // Entidad: Empleador & Oferta (Relación 1:N)
    const ofertasDB = [
        {
            ID_Oferta: 501,
            Empresa: "VerdeTech Solutions",
            Contrato: "Tiempo Completo",
            Requisitos: "Dominio de JS nativo, CSS Grid/Flexbox, HTML semántico.",
            SalarioOferta: "$3.500.000 COP",
            Condiciones_laborales: "Remoto flexible",
            Empleador: {
                ID_Empleador: 301,
                Nombres: "Laura Gómez",
                Correo_Electronico: "contacto@verdetech.io",
                Direccion: "Calle 100 #15-20"
            }
        },
        {
            ID_Oferta: 502,
            Empresa: "BioStudio",
            Contrato: "Medio Tiempo",
            Requisitos: "Maquetación responsive y prototipado Figma.",
            SalarioOferta: "$2.000.000 COP",
            Condiciones_laborales: "Presencial 2 días por semana",
            Empleador: {
                ID_Empleador: 302,
                Nombres: "Carlos Ruiz",
                Correo_Electronico: "jobs@biostudio.co",
                Direccion: "Carrera 7 #45-10"
            }
        }
    ];

    // Entidad: Postulaciones (Corregida: guarda ID_Oferta e ID_Empleado)
    const postulacionesDB = [
        {
            ID_Postulacion: 901,
            Formulario: "Adjunto perfil Workseed",
            Evaluacion_u_entrevista: "Pendiente revisión",
            ID_Empleado: 101,
            ID_Oferta: 501
        }
    ];

    // 3. Renderizar Datos del Empleado y Hoja de Vida
    document.getElementById('emp-nombre').textContent = `${empleadoActual.Datos_generales.nombres} ${empleadoActual.Datos_generales.apellidos}`;
    document.getElementById('emp-username').textContent = `@${empleadoActual.Nombre_usuario}`;
    document.getElementById('emp-correo').textContent = empleadoActual.Correo_electronico;

    document.getElementById('hv-experiencia').textContent = hojaDeVida.Experiencia_laboral;
    document.getElementById('hv-academica').textContent = hojaDeVida.Informacion_academica;
    document.getElementById('hv-datos').textContent = hojaDeVida.Datos_caracteristicos;

    // 4. Renderizar Publicaciones de Ofertas
    const offersFeed = document.getElementById('offers-feed');

    function renderFeed() {
        offersFeed.innerHTML = '';
        ofertasDB.forEach(oferta => {
            const post = document.createElement('article');
            post.className = 'card post-card';
            post.innerHTML = `
                <div class="post-header">
                    <div>
                        <h4 class="employer-title">${oferta.Empresa}</h4>
                        <span class="employer-info">Publicado por ${oferta.Empleador.Nombres} (${oferta.Contrato})</span>
                    </div>
                    <span class="salary-tag">${oferta.SalarioOferta}</span>
                </div>
                <div class="post-body">
                    <p><strong>Requisitos:</strong> ${oferta.Requisitos}</p>
                    <p><strong>Condiciones:</strong> ${oferta.Condiciones_laborales}</p>
                </div>
                <div class="post-actions">
                    <button class="btn-apply" onclick="postularAOferta(${oferta.ID_Oferta})">Postularme</button>
                </div>
            `;
            offersFeed.appendChild(post);
        });
    }

    // 5. Renderizar Lista de Postulaciones en Panel Derecho
    const postulacionesContainer = document.getElementById('postulaciones-list');

    window.renderPostulaciones = function() {
        postulacionesContainer.innerHTML = '';
        postulacionesDB.forEach(post => {
            const ofertaAsociada = ofertasDB.find(o => o.ID_Oferta === post.ID_Oferta);
            const item = document.createElement('div');
            item.className = 'postulacion-card';
            item.innerHTML = `
                <strong>${ofertaAsociada ? ofertaAsociada.Empresa : 'Empresa'}</strong>
                <p>Estado: <span class="status">${post.Evaluacion_u_entrevista}</span></p>
            `;
            postulacionesContainer.appendChild(item);
        });
    };

    // 6. Acción de Postulación (Creación de registro Postulaciones)
    window.postularAOferta = function(idOferta) {
        const existe = postulacionesDB.some(p => p.ID_Oferta === idOferta && p.ID_Empleado === empleadoActual.ID_Empleado);
        
        if (existe) {
            alert("Ya te has postulado a esta oferta laboral previamente.");
            return;
        }

        const nuevaPostulacion = {
            ID_Postulacion: Date.now(),
            Formulario: "Postulación rápida mediante Workseed",
            Evaluacion_u_entrevista: "En revisión inicial",
            ID_Empleado: empleadoActual.ID_Empleado,
            ID_Oferta: idOferta
        };

        postulacionesDB.push(nuevaPostulacion);
        window.renderPostulaciones();
        alert("¡Postulación enviada exitosamente!");
    };

    // Inicializar renders
    renderFeed();
    window.renderPostulaciones();
});
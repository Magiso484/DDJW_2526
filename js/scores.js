import {$} from "../library/jquery-4.0.0.slim.module.min.js";

$(function() {
    const rankingBody = $('#ranking-body');
    
    // Llegim el rànquing del localStorage (o un array buit si no n'hi ha)
    let ranking = JSON.parse(localStorage.getItem('ranking') || '[]');

    // Si no hi ha puntuacions, mostrem un missatge
    if (ranking.length === 0) {
        rankingBody.append('<tr><td colspan="3">Encara no hi ha cap puntuació registrada.</td></tr>');
    } else {
        // Ordenem per punts (descendent) i agafem els 10 millors
        ranking.sort((a, b) => b.points - a.points);
        ranking = ranking.slice(0, 10);

        ranking.forEach((entry, index) => {
            rankingBody.append(`
                <tr style="border-bottom: 1px solid #444; height: 40px;">
                    <td>${index + 1}</td>
                    <td>${entry.name}</td>
                    <td style="color: lime; font-weight: bold;">${entry.points}</td>
                </tr>
            `);
        });
    }

    $('#back-to-menu').on('click', () => window.location.assign("../index.html"));
});
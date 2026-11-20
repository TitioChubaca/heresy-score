/* Spotify folders are client-side only: the Spotify Web API cannot create,
   list, inspect or move playlist folders. A user-created EMPTY playlist inside
   a folder can be safely linked before the Prelude audit. */
(()=>{
"use strict";
const panel=document.querySelector('[data-view-panel="settings"]');
if(!panel)return;
const box=document.createElement("section");
box.className="panel";box.id="hsSpotifyFolderHelp";
box.innerHTML='<h2>Spotify · pasta Heresy Score</h2>'+
 '<p class="small">O Spotify não permite criar ou mover pastas pela API. Crie manualmente <strong>Heresy Score — Horus Heresy</strong> na Sua Biblioteca → + → Pasta. Você pode adicionar subpastas por livro.</p>'+
 '<p class="small">Para evitar uma playlist nova fora da pasta, crie uma <strong>playlist vazia dentro da pasta</strong>, abra ⋯ → Compartilhar → Copiar link, e vincule-a abaixo. Isso é opcional: o app também pode criar uma playlist não pública, que você pode mover depois.</p>'+
 '<label class="small" for="hsSpotifyFolderPlaylistLink">Link da playlist vazia para o próximo capítulo</label>'+
 '<input id="hsSpotifyFolderPlaylistLink" type="url" inputmode="url" autocomplete="off" placeholder="https://open.spotify.com/playlist/..." style="width:100%;min-width:0;min-height:44px;padding:10px;background:#101a0f;color:#d8d7c5;border:1px solid #536947">'+
 '<div class="actions"><button id="hsSpotifyFolderBind" type="button" class="btn">Vincular playlist existente</button></div>'+
 '<p id="hsSpotifyFolderResult" class="small" role="status" aria-live="polite"></p>'+
 '<a href="https://support.spotify.com/br-pt/article/playlist-folders/" target="_blank" rel="noopener noreferrer" class="small" style="color:#a8db72">Guia oficial: pastas de playlists</a>';
panel.append(box);
const input=box.querySelector("#hsSpotifyFolderPlaylistLink");
const status=box.querySelector("#hsSpotifyFolderResult");
const bind=box.querySelector("#hsSpotifyFolderBind");
function playlistId(value){
 const s=String(value||"").trim();
 const m=s.match(/(?:open\.spotify\.com\/playlist\/|spotify:playlist:)([A-Za-z0-9]{22})(?:[?&#/]|$)/);
 return m?.[1]||null;
}
bind.onclick=async()=>{
 if(bind.disabled)return;
 bind.disabled=true;status.textContent="Validando sua playlist no Spotify sem alterar músicas...";
 try{
  if(state.active)throw Error("Finalize ou pause a leitura antes de vincular playlists.");
  if(!spotifyConnected())throw Error("Conecte o Spotify nas Configurações.");
  const slug=state.activeBookSlug;
  const n=chapters.find(x=>!state.done?.[x.number]&&!!SCORES[x.number]&&
   (x.number===1||!!state.done?.[x.number-1]))?.number;
  if(!n)throw Error("Selecione um livro com uma unidade musical disponível.");
  const id=playlistId(input.value);
  if(!id)throw Error("Copie um link completo do Spotify, no formato open.spotify.com/playlist/...");
  const key=slug+":"+n;
  const linked=state.spotify.playlists?.[key];
  if(linked?.id&&linked.id!==id)throw Error("Este capítulo já possui playlist vinculada. Para não perder o histórico, mova essa playlist no Spotify em vez de substituí-la.");
  for(const [otherKey,entry] of Object.entries(state.spotify.playlists||{}))
   if(otherKey!==key&&entry?.id===id)throw Error("Playlist já está associada a "+otherKey+". Não reutilize para outro capítulo.");
  const [me,p]=await Promise.all([
   spotifyApi("/me"),spotifyApi("/playlists/"+encodeURIComponent(id))
  ]);
  if(!me?.id||p?.owner?.id!==me.id)throw Error("A playlist precisa ser sua, não uma playlist colaborativa ou de outra pessoa.");
  if(p.collaborative)throw Error("Playlists colaborativas não são aceitas para a curadoria.");
  if(!linked?.id){
   const page=await spotifyApi("/playlists/"+encodeURIComponent(id)+"/items?limit=1");
   if(!Array.isArray(page?.items)||page.items.length)
    throw Error("A playlist precisa estar vazia. A auditoria substitui faixas e não pode apagar músicas pessoais.");
  }
  if(!window.confirm("Vincular esta playlist ao "+HSBooks.unitLabel(slug,n)+"? O Heresy Score poderá preencher sua lista com as músicas curadas."))return;
  if(state.activeBookSlug!==slug)throw Error("Livro alterado. Vinculação cancelada.");
  // A playlist manually created by the user may be shown on their profile.
  // Explicitly unpublish it to preserve reading preferences.
  await spotifyApi("/playlists/"+encodeURIComponent(id),{
   method:"PUT",body:JSON.stringify({public:false,
    name:"Heresy Score | "+(slug===HSBooks.VI?"VI":slug===HSBooks.V?"V":"IV")+" — "+
     (state.books?.[slug]?.title||slug)+" | "+HSBooks.unitLabel(slug,n),
    description:"Trilha de leitura pessoal gerenciada pelo Heresy Score."})
  });
  state.spotify.playlists=state.spotify.playlists||{};
  state.spotify.playlists[key]={...(linked||{}),id,
   url:p.external_urls?.spotify||"https://open.spotify.com/playlist/"+id,
   connectedFromUserFolder:true};
  save();
  status.textContent="Playlist "+HSBooks.unitLabel(slug,n)+" vinculada e não pública. "+
   "Agora use Auditar trilha no cartão. A API não consegue verificar em qual pasta a playlist está.";
  input.value="";
 }catch(err){status.textContent="Vinculação NÃO concluída: "+String(err?.message||err);}
 finally{bind.disabled=false;}
};
})();

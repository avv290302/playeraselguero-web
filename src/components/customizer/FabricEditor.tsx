"use client";

import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type ChangeEvent,
} from "react";

import {
  Canvas,
  FabricImage,
  Textbox,
} from "fabric";

export type EditorSnapshot = {
  preview: string;
  json: string;
  objectCount: number;
};

type FabricEditorProps = {
  onChange?: (
    snapshot: EditorSnapshot
  ) => void;
};

const HISTORY_LIMIT = 40;

/* ========================================================= */
/* ARCHIVO → DATA URL */
/* ========================================================= */

function fileToDataUrl(
  file: File
): Promise<string> {
  return new Promise(
    (resolve, reject) => {
      const reader =
        new FileReader();

      reader.onload = () => {
        if (
          typeof reader.result ===
          "string"
        ) {
          resolve(
            reader.result
          );

          return;
        }

        reject(
          new Error(
            "No fue posible leer la imagen."
          )
        );
      };

      reader.onerror = () => {
        reject(
          new Error(
            "No fue posible leer la imagen."
          )
        );
      };

      reader.readAsDataURL(
        file
      );
    }
  );
}

/* ========================================================= */
/* COMPONENTE */
/* ========================================================= */

export default function FabricEditor({
  onChange,
}: FabricEditorProps) {
  const htmlCanvasRef =
    useRef<HTMLCanvasElement | null>(
      null
    );

  const fabricCanvasRef =
    useRef<Canvas | null>(
      null
    );

  const fileInputRef =
    useRef<HTMLInputElement | null>(
      null
    );

  const onChangeRef =
    useRef(onChange);

  const snapshotFrameRef =
    useRef<number | null>(
      null
    );

  /* ======================================================= */
  /* HISTORIAL */
  /* ======================================================= */

  const undoStackRef =
    useRef<string[]>([]);

  const redoStackRef =
    useRef<string[]>([]);

  const restoringHistoryRef =
    useRef(false);

  const [
    canUndo,
    setCanUndo,
  ] = useState(false);

  const [
    canRedo,
    setCanRedo,
  ] = useState(false);

  /* ======================================================= */
  /* ID ÚNICO INPUT */
  /* ======================================================= */

  const reactId =
    useId();

  const uploadInputId =
    `professional-logo-${reactId.replace(
      /:/g,
      ""
    )}`;

  /* ======================================================= */
  /* ESTADOS */
  /* ======================================================= */

  const [
    textValue,
    setTextValue,
  ] = useState(
    "Tu texto"
  );

  const [
    selectedTextColor,
    setSelectedTextColor,
  ] = useState(
    "#ffffff"
  );

  const [
    selectedType,
    setSelectedType,
  ] = useState<
    "text" | "image" | null
  >(null);

  const [
    objectCount,
    setObjectCount,
  ] = useState(0);

  /* ======================================================= */
  /* CALLBACK ONCHANGE */
  /* ======================================================= */

  useEffect(() => {
    onChangeRef.current =
      onChange;
  }, [onChange]);

  /* ======================================================= */
  /* ESTADO DE BOTONES */
  /* ======================================================= */

  const updateHistoryButtons =
    useCallback(() => {
      setCanUndo(
        undoStackRef.current
          .length > 1
      );

      setCanRedo(
        redoStackRef.current
          .length > 0
      );
    }, []);

  /* ======================================================= */
  /* ACTUALIZAR 3D */
  /* ======================================================= */

  const emitSnapshot =
    useCallback(() => {
      const canvas =
        fabricCanvasRef.current;

      if (!canvas) {
        return;
      }

      if (
        snapshotFrameRef.current !==
        null
      ) {
        cancelAnimationFrame(
          snapshotFrameRef.current
        );
      }

      snapshotFrameRef.current =
        requestAnimationFrame(
          () => {
            const currentCanvas =
              fabricCanvasRef.current;

            if (
              !currentCanvas
            ) {
              return;
            }

            currentCanvas.renderAll();

            const count =
              currentCanvas
                .getObjects()
                .length;

            setObjectCount(
              count
            );

            const preview =
              currentCanvas.toDataURL(
                {
                  format: "png",
                  multiplier: 1,
                }
              );

            const json =
              JSON.stringify(
                currentCanvas.toJSON()
              );

            onChangeRef.current?.({
              preview,
              json,
              objectCount:
                count,
            });

            snapshotFrameRef.current =
              null;
          }
        );
    }, []);

  /* ======================================================= */
  /* GUARDAR HISTORIAL */
  /* ======================================================= */

  const saveHistory =
    useCallback(() => {
      const canvas =
        fabricCanvasRef.current;

      if (
        !canvas ||
        restoringHistoryRef.current
      ) {
        return;
      }

      const json =
        JSON.stringify(
          canvas.toJSON()
        );

      const history =
        undoStackRef.current;

      const last =
        history[
          history.length - 1
        ];

      if (last === json) {
        return;
      }

      history.push(
        json
      );

      if (
        history.length >
        HISTORY_LIMIT
      ) {
        history.shift();
      }

      redoStackRef.current =
        [];

      updateHistoryButtons();
    }, [
      updateHistoryButtons,
    ]);

  /* ======================================================= */
  /* RESTAURAR HISTORIAL */
  /* ======================================================= */

  const restoreState =
    useCallback(
      async (
        json: string
      ) => {
        const canvas =
          fabricCanvasRef.current;

        if (!canvas) {
          return;
        }

        restoringHistoryRef.current =
          true;

        canvas.discardActiveObject();

        try {
          await canvas.loadFromJSON(
            json
          );

          canvas.renderAll();

          setSelectedType(
            null
          );

          emitSnapshot();
        } catch (error) {
          console.error(
            "Error restaurando historial:",
            error
          );
        } finally {
          restoringHistoryRef.current =
            false;

          updateHistoryButtons();
        }
      },
      [
        emitSnapshot,
        updateHistoryButtons,
      ]
    );

  /* ======================================================= */
  /* DESHACER */
  /* ======================================================= */

  const undo =
    useCallback(async () => {
      if (
        restoringHistoryRef.current
      ) {
        return;
      }

      if (
        undoStackRef.current
          .length <= 1
      ) {
        return;
      }

      const current =
        undoStackRef.current.pop();

      if (current) {
        redoStackRef.current.push(
          current
        );
      }

      const previous =
        undoStackRef.current[
          undoStackRef.current
            .length - 1
        ];

      if (previous) {
        await restoreState(
          previous
        );
      }

      updateHistoryButtons();
    }, [
      restoreState,
      updateHistoryButtons,
    ]);

  /* ======================================================= */
  /* REHACER */
  /* ======================================================= */

  const redo =
    useCallback(async () => {
      if (
        restoringHistoryRef.current
      ) {
        return;
      }

      const next =
        redoStackRef.current.pop();

      if (!next) {
        return;
      }

      undoStackRef.current.push(
        next
      );

      await restoreState(
        next
      );

      updateHistoryButtons();
    }, [
      restoreState,
      updateHistoryButtons,
    ]);

  /* ======================================================= */
  /* CREAR CANVAS */
  /* ======================================================= */

  useEffect(() => {
    if (
      !htmlCanvasRef.current
    ) {
      return;
    }

    const canvas =
      new Canvas(
        htmlCanvasRef.current,
        {
          width: 500,
          height: 560,

          backgroundColor:
            "transparent",

          preserveObjectStacking:
            true,

          selection: true,
        }
      );

    fabricCanvasRef.current =
      canvas;

    /* ===================================================== */
    /* SELECCIÓN */
    /* ===================================================== */

    const updateSelection =
      () => {
        const active =
          canvas.getActiveObject();

        if (!active) {
          setSelectedType(
            null
          );

          return;
        }

        if (
          active instanceof
          Textbox
        ) {
          setSelectedType(
            "text"
          );

          const fill =
            active.fill;

          if (
            typeof fill ===
            "string"
          ) {
            setSelectedTextColor(
              fill
            );
          }

          return;
        }

        setSelectedType(
          "image"
        );
      };

    /* ===================================================== */
    /* CAMBIOS */
    /* ===================================================== */

    const handleAdded =
      () => {
        if (
          restoringHistoryRef.current
        ) {
          return;
        }

        emitSnapshot();
        saveHistory();
      };

    const handleRemoved =
      () => {
        if (
          restoringHistoryRef.current
        ) {
          return;
        }

        emitSnapshot();
        saveHistory();
      };

    const handleModified =
      () => {
        if (
          restoringHistoryRef.current
        ) {
          return;
        }

        emitSnapshot();
        saveHistory();
      };

    const handleLiveChange =
      () => {
        if (
          restoringHistoryRef.current
        ) {
          return;
        }

        emitSnapshot();
      };

    canvas.on(
      "selection:created",
      updateSelection
    );

    canvas.on(
      "selection:updated",
      updateSelection
    );

    canvas.on(
      "selection:cleared",
      updateSelection
    );

    canvas.on(
      "object:added",
      handleAdded
    );

    canvas.on(
      "object:removed",
      handleRemoved
    );

    canvas.on(
      "object:modified",
      handleModified
    );

    canvas.on(
      "object:moving",
      handleLiveChange
    );

    canvas.on(
      "object:scaling",
      handleLiveChange
    );

    canvas.on(
      "object:rotating",
      handleLiveChange
    );

    canvas.on(
      "text:changed",
      handleLiveChange
    );

    /* ===================================================== */
    /* ESTADO INICIAL */
    /* ===================================================== */

    undoStackRef.current = [
      JSON.stringify(
        canvas.toJSON()
      ),
    ];

    redoStackRef.current =
      [];

    updateHistoryButtons();

    emitSnapshot();

    /* ===================================================== */
    /* CLEANUP */
    /* ===================================================== */

    return () => {
      if (
        snapshotFrameRef.current !==
        null
      ) {
        cancelAnimationFrame(
          snapshotFrameRef.current
        );
      }

      fabricCanvasRef.current =
        null;

      canvas.dispose();
    };
  }, [
    emitSnapshot,
    saveHistory,
    updateHistoryButtons,
  ]);

  /* ======================================================= */
  /* AGREGAR TEXTO */
  /* ======================================================= */

  function addText() {
    const canvas =
      fabricCanvasRef.current;

    if (!canvas) {
      return;
    }

    const value =
      textValue.trim() ||
      "Tu texto";

    const text =
      new Textbox(
        value,
        {
          left: 150,
          top: 180,

          width: 200,

          fill:
            selectedTextColor,

          fontSize: 42,

          fontWeight: 700,

          fontFamily:
            "Arial",

          textAlign:
            "center",

          transparentCorners:
            false,

          cornerColor:
            "#dc2626",

          cornerStrokeColor:
            "#ffffff",

          borderColor:
            "#dc2626",

          cornerSize: 12,

          padding: 8,
        }
      );

    canvas.add(
      text
    );

    canvas.setActiveObject(
      text
    );

    canvas.renderAll();

    setSelectedType(
      "text"
    );

    emitSnapshot();
  }

  /* ======================================================= */
  /* AGREGAR IMÁGENES */
  /* ======================================================= */

  async function addImages(
    event: ChangeEvent<HTMLInputElement>
  ) {
    const canvas =
      fabricCanvasRef.current;

    if (!canvas) {
      return;
    }

    const files =
      Array.from(
        event.target.files ??
          []
      );

    if (
      files.length === 0
    ) {
      return;
    }

    const allowedTypes = [
      "image/png",
      "image/jpeg",
      "image/webp",
    ];

    for (
      let index = 0;
      index <
      files.length;
      index += 1
    ) {
      const file =
        files[index];

      if (
        !allowedTypes.includes(
          file.type
        )
      ) {
        continue;
      }

      try {
        const dataUrl =
          await fileToDataUrl(
            file
          );

        const image =
          await FabricImage.fromURL(
            dataUrl
          );

        const originalWidth =
          image.width || 1;

        const originalHeight =
          image.height || 1;

        const maximumWidth =
          190;

        const maximumHeight =
          190;

        const scale =
          Math.min(
            maximumWidth /
              originalWidth,

            maximumHeight /
              originalHeight,

            1
          );

        image.set({
          left:
            155 +
            index * 12,

          top:
            170 +
            index * 12,

          transparentCorners:
            false,

          cornerColor:
            "#dc2626",

          cornerStrokeColor:
            "#ffffff",

          borderColor:
            "#dc2626",

          cornerSize: 12,

          padding: 6,
        });

        image.scale(
          scale
        );

        canvas.add(
          image
        );

        canvas.setActiveObject(
          image
        );

        setSelectedType(
          "image"
        );
      } catch (error) {
        console.error(
          "No fue posible agregar la imagen:",
          error
        );
      }
    }

    canvas.renderAll();

    emitSnapshot();

    if (
      fileInputRef.current
    ) {
      fileInputRef.current.value =
        "";
    }
  }

  /* ======================================================= */
  /* ELIMINAR */
  /* ======================================================= */

  function deleteSelected() {
    const canvas =
      fabricCanvasRef.current;

    if (!canvas) {
      return;
    }

    const activeObjects =
      canvas.getActiveObjects();

    if (
      activeObjects.length ===
      0
    ) {
      return;
    }

    /*
     * Para selección múltiple
     * guardamos solamente un estado.
     */
    restoringHistoryRef.current =
      true;

    activeObjects.forEach(
      (object) => {
        canvas.remove(
          object
        );
      }
    );

    restoringHistoryRef.current =
      false;

    canvas.discardActiveObject();

    canvas.renderAll();

    setSelectedType(
      null
    );

    emitSnapshot();
    saveHistory();
  }

  /* ======================================================= */
  /* DUPLICAR */
  /* ======================================================= */

  async function duplicateSelected() {
    const canvas =
      fabricCanvasRef.current;

    if (!canvas) {
      return;
    }

    const active =
      canvas.getActiveObject();

    if (!active) {
      return;
    }

    try {
      const clone =
        await active.clone();

      clone.set({
        left:
          (active.left ??
            0) + 20,

        top:
          (active.top ??
            0) + 20,

        evented: true,
      });

      canvas.add(
        clone
      );

      canvas.setActiveObject(
        clone
      );

      canvas.renderAll();

      emitSnapshot();
    } catch (error) {
      console.error(
        "No fue posible duplicar el elemento:",
        error
      );
    }
  }

  /* ======================================================= */
  /* COLOR TEXTO */
  /* ======================================================= */

  function updateTextColor(
    color: string
  ) {
    setSelectedTextColor(
      color
    );

    const canvas =
      fabricCanvasRef.current;

    if (!canvas) {
      return;
    }

    const active =
      canvas.getActiveObject();

    if (
      !(
        active instanceof
        Textbox
      )
    ) {
      return;
    }

    active.set({
      fill: color,
    });

    canvas.renderAll();

    emitSnapshot();
    saveHistory();
  }

  /* ======================================================= */
  /* LIMPIAR */
  /* ======================================================= */

  function clearCanvas() {
    const canvas =
      fabricCanvasRef.current;

    if (!canvas) {
      return;
    }

    const objects =
      [...canvas.getObjects()];

    if (
      objects.length === 0
    ) {
      return;
    }

    restoringHistoryRef.current =
      true;

    objects.forEach(
      (object) => {
        canvas.remove(
          object
        );
      }
    );

    restoringHistoryRef.current =
      false;

    canvas.discardActiveObject();

    canvas.renderAll();

    setSelectedType(
      null
    );

    emitSnapshot();
    saveHistory();
  }

  /* ======================================================= */
  /* ATAJOS CTRL+Z / CTRL+Y */
  /* ======================================================= */

  useEffect(() => {
    const handleKeyboard =
      (
        event: KeyboardEvent
      ) => {
        const target =
          event.target as
            | HTMLElement
            | null;

        if (
          target?.tagName ===
            "INPUT" ||
          target?.tagName ===
            "TEXTAREA"
        ) {
          return;
        }

        const commandKey =
          event.ctrlKey ||
          event.metaKey;

        if (!commandKey) {
          return;
        }

        if (
          event.key.toLowerCase() ===
            "z" &&
          !event.shiftKey
        ) {
          event.preventDefault();

          void undo();

          return;
        }

        if (
          event.key.toLowerCase() ===
            "y" ||
          (
            event.key.toLowerCase() ===
              "z" &&
            event.shiftKey
          )
        ) {
          event.preventDefault();

          void redo();
        }
      };

    window.addEventListener(
      "keydown",
      handleKeyboard
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyboard
      );
    };
  }, [
    undo,
    redo,
  ]);

  /* ======================================================= */
  /* UI */
  /* ======================================================= */

  return (
    <div className="grid w-full min-w-0 gap-5 overflow-hidden">
      {/* ================================================= */}
      {/* HISTORIAL */}
      {/* ================================================= */}

      <div className="w-full min-w-0 rounded-2xl border border-white/10 bg-[#111] p-4">
        <div className="flex min-w-0 items-center justify-between gap-4">
          <div className="min-w-0">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-red-500">
              Historial
            </p>

            <p className="mt-1 text-xs leading-5 text-zinc-600">
              Deshaz o recupera tus últimos cambios.
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              onClick={() =>
                void undo()
              }
              disabled={
                !canUndo
              }
              title="Deshacer"
              aria-label="Deshacer"
              className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 bg-black text-2xl font-bold text-white transition hover:border-red-500/50 hover:text-red-500 disabled:cursor-not-allowed disabled:opacity-25"
            >
              ↶
            </button>

            <button
              type="button"
              onClick={() =>
                void redo()
              }
              disabled={
                !canRedo
              }
              title="Rehacer"
              aria-label="Rehacer"
              className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 bg-black text-2xl font-bold text-white transition hover:border-red-500/50 hover:text-red-500 disabled:cursor-not-allowed disabled:opacity-25"
            >
              ↷
            </button>
          </div>
        </div>
      </div>

      {/* ================================================= */}
      {/* HERRAMIENTAS */}
      {/* ================================================= */}

      <div className="w-full min-w-0 rounded-2xl border border-white/10 bg-[#111] p-5">
        <div className="flex min-w-0 flex-col gap-5">
          {/* ============================================= */}
          {/* TEXTO */}
          {/* ============================================= */}

          <div className="min-w-0">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-zinc-500">
              Agregar texto
            </p>

            <div className="mt-3 flex min-w-0 gap-2">
              <input
                type="text"
                value={
                  textValue
                }
                onChange={(
                  event
                ) =>
                  setTextValue(
                    event.target
                      .value
                  )
                }
                onKeyDown={(
                  event
                ) => {
                  if (
                    event.key ===
                    "Enter"
                  ) {
                    addText();
                  }
                }}
                placeholder="Escribe tu texto"
                className="min-w-0 flex-1 rounded-xl border border-white/10 bg-black px-4 py-3 text-sm text-white outline-none transition placeholder:text-zinc-700 focus:border-red-500"
              />

              <button
                type="button"
                onClick={
                  addText
                }
                className="shrink-0 rounded-xl bg-red-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-red-500"
              >
                + Texto
              </button>
            </div>
          </div>

          {/* ============================================= */}
          {/* IMÁGENES */}
          {/* ============================================= */}

          <div className="min-w-0">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-zinc-500">
              Agregar logos
            </p>

            <label
              htmlFor={
                uploadInputId
              }
              className="mt-3 flex min-w-0 cursor-pointer items-center justify-between gap-4 rounded-xl border border-dashed border-white/15 bg-black px-4 py-4 transition hover:border-red-500/50"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-bold text-white">
                  Subir logos o imágenes
                </p>

                <p className="mt-1 text-xs leading-5 text-zinc-600">
                  PNG, JPG o WEBP. Puedes seleccionar varios.
                </p>
              </div>

              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/5 text-xl text-white">
                +
              </span>
            </label>

            <input
              ref={
                fileInputRef
              }
              id={
                uploadInputId
              }
              type="file"
              accept="image/png,image/jpeg,image/webp"
              multiple
              onChange={
                addImages
              }
              className="hidden"
            />
          </div>

          {/* ============================================= */}
          {/* COLOR TEXTO */}
          {/* ============================================= */}

          {selectedType ===
            "text" && (
            <div className="border-t border-white/10 pt-5">
              <div className="flex min-w-0 items-center justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-sm font-bold text-white">
                    Color del texto
                  </p>

                  <p className="mt-1 text-xs leading-5 text-zinc-600">
                    Cambia el color del elemento seleccionado.
                  </p>
                </div>

                <input
                  type="color"
                  value={
                    selectedTextColor
                  }
                  onChange={(
                    event
                  ) =>
                    updateTextColor(
                      event.target
                        .value
                    )
                  }
                  className="h-11 w-14 shrink-0 cursor-pointer rounded-lg border border-white/10 bg-black p-1"
                />
              </div>
            </div>
          )}

          {/* ============================================= */}
          {/* SELECCIONADO */}
          {/* ============================================= */}

          <div className="border-t border-white/10 pt-5">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-zinc-500">
              Elemento seleccionado
            </p>

            <div className="mt-3 grid min-w-0 grid-cols-2 gap-2">
              <button
                type="button"
                onClick={
                  duplicateSelected
                }
                disabled={
                  !selectedType
                }
                className="min-w-0 rounded-xl border border-white/10 px-3 py-3 text-xs font-bold uppercase tracking-wider text-white transition hover:border-white/30 disabled:cursor-not-allowed disabled:opacity-30"
              >
                Duplicar
              </button>

              <button
                type="button"
                onClick={
                  deleteSelected
                }
                disabled={
                  !selectedType
                }
                className="min-w-0 rounded-xl border border-red-500/20 px-3 py-3 text-xs font-bold uppercase tracking-wider text-red-500 transition hover:border-red-500 disabled:cursor-not-allowed disabled:opacity-30"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ================================================= */}
      {/* CANVAS */}
      {/* ================================================= */}

      <div className="w-full min-w-0 overflow-hidden rounded-2xl border border-white/10 bg-[linear-gradient(45deg,#111_25%,transparent_25%),linear-gradient(-45deg,#111_25%,transparent_25%),linear-gradient(45deg,transparent_75%,#111_75%),linear-gradient(-45deg,transparent_75%,#111_75%)] bg-[length:24px_24px] bg-[position:0_0,0_12px,12px_-12px,-12px_0px]">
        <div className="mx-auto w-full min-w-0 max-w-[500px] overflow-x-auto overflow-y-hidden">
          <canvas
            ref={
              htmlCanvasRef
            }
          />
        </div>
      </div>

      {/* ================================================= */}
      {/* ESTADO */}
      {/* ================================================= */}

      <div className="flex w-full min-w-0 flex-wrap items-center justify-between gap-3">
        <p className="min-w-0 text-xs text-zinc-600">
          {objectCount === 0
            ? "Agrega texto o imágenes para comenzar."
            : `${objectCount} ${
                objectCount ===
                1
                  ? "elemento"
                  : "elementos"
              } en el diseño.`}
        </p>

        <button
          type="button"
          onClick={
            clearCanvas
          }
          disabled={
            objectCount === 0
          }
          className="shrink-0 text-xs font-bold uppercase tracking-wider text-zinc-500 transition hover:text-red-500 disabled:opacity-30"
        >
          Limpiar diseño
        </button>
      </div>

      {/* ================================================= */}
      {/* AYUDA */}
      {/* ================================================= */}

      <div className="w-full min-w-0 rounded-xl border border-white/10 bg-white/[0.02] p-4">
        <p className="text-xs leading-5 text-zinc-500">
          Selecciona un elemento para moverlo, rotarlo o cambiar su tamaño. Los cambios se sincronizan automáticamente con la vista 3D.
        </p>
      </div>
    </div>
  );
}
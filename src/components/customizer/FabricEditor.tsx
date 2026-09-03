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

export type FabricEditorPanel =
  | "design"
  | "text"
  | "layers";

type FabricEditorProps = {
  onChange?: (
    snapshot: EditorSnapshot
  ) => void;

  panel?: FabricEditorPanel;
};

type SelectedType =
  | "text"
  | "image"
  | null;

type TextAlignment =
  | "left"
  | "center"
  | "right";

type LayerType =
  | "text"
  | "image";

type LayerItem = {
  stackIndex: number;
  type: LayerType;
  label: string;
};

/* ========================================================= */
/* CONFIGURACIÓN */
/* ========================================================= */

const HISTORY_LIMIT = 40;

const FONT_OPTIONS = [
  "Arial",
  "Arial Black",
  "Impact",
  "Verdana",
  "Trebuchet MS",
  "Georgia",
  "Times New Roman",
  "Courier New",
];

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
  panel = "design",
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
  /* INPUT */
  /* ======================================================= */

  const reactId =
    useId();

  const uploadInputId =
    `professional-logo-${reactId.replace(
      /:/g,
      ""
    )}`;

  /* ======================================================= */
  /* ESTADO GENERAL */
  /* ======================================================= */

  const [
    textValue,
    setTextValue,
  ] = useState(
    "Tu texto"
  );

  const [
    selectedType,
    setSelectedType,
  ] =
    useState<SelectedType>(
      null
    );

  const [
    objectCount,
    setObjectCount,
  ] = useState(0);

  /* ======================================================= */
  /* CAPAS */
  /* ======================================================= */

  const [
    layers,
    setLayers,
  ] = useState<
    LayerItem[]
  >([]);

  const [
    selectedLayerStackIndex,
    setSelectedLayerStackIndex,
  ] = useState<
    number | null
  >(null);

  /* ======================================================= */
  /* TRANSFORMACIÓN */
  /* ======================================================= */

  const [
    selectedX,
    setSelectedX,
  ] = useState(0);

  const [
    selectedY,
    setSelectedY,
  ] = useState(0);

  const [
    selectedAngle,
    setSelectedAngle,
  ] = useState(0);

  const [
    selectedScale,
    setSelectedScale,
  ] = useState(100);

  /* ======================================================= */
  /* TEXTO */
  /* ======================================================= */

  const [
    selectedTextColor,
    setSelectedTextColor,
  ] = useState(
    "#ffffff"
  );

  const [
    selectedFontFamily,
    setSelectedFontFamily,
  ] = useState(
    "Arial"
  );

  const [
    selectedFontSize,
    setSelectedFontSize,
  ] = useState(
    42
  );

  const [
    selectedBold,
    setSelectedBold,
  ] = useState(
    true
  );

  const [
    selectedItalic,
    setSelectedItalic,
  ] = useState(
    false
  );

  const [
    selectedAlignment,
    setSelectedAlignment,
  ] =
    useState<TextAlignment>(
      "center"
    );

  /* ======================================================= */
  /* CALLBACK */
  /* ======================================================= */

  useEffect(() => {
    onChangeRef.current =
      onChange;
  }, [onChange]);

  /* ======================================================= */
  /* HISTORIAL */
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
  /* SNAPSHOT 3D */
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

            if (!currentCanvas) {
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
  /* SINCRONIZAR TEXTO */
  /* ======================================================= */

  const syncTextControls =
    useCallback(
      (
        text: Textbox
      ) => {
        const fill =
          text.fill;

        if (
          typeof fill ===
          "string"
        ) {
          setSelectedTextColor(
            fill
          );
        }

        setSelectedFontFamily(
          text.fontFamily ||
            "Arial"
        );

        setSelectedFontSize(
          Math.round(
            text.fontSize ||
              42
          )
        );

        setSelectedBold(
          text.fontWeight ===
            "bold" ||
            Number(
              text.fontWeight
            ) >= 600
        );

        setSelectedItalic(
          text.fontStyle ===
            "italic"
        );

        const alignment =
          text.textAlign;

        if (
          alignment ===
            "left" ||
          alignment ===
            "center" ||
          alignment ===
            "right"
        ) {
          setSelectedAlignment(
            alignment
          );
        }
      },
      []
    );

  /* ======================================================= */
  /* SINCRONIZAR TRANSFORM */
  /* ======================================================= */

  const syncTransformControls =
    useCallback(() => {
      const canvas =
        fabricCanvasRef.current;

      if (!canvas) {
        return;
      }

      const active =
        canvas.getActiveObject();

      if (!active) {
        setSelectedX(0);
        setSelectedY(0);
        setSelectedAngle(0);
        setSelectedScale(100);

        return;
      }

      setSelectedX(
        Math.round(
          active.left ?? 0
        )
      );

      setSelectedY(
        Math.round(
          active.top ?? 0
        )
      );

      setSelectedAngle(
        Math.round(
          active.angle ?? 0
        )
      );

      const scaleX =
        active.scaleX ?? 1;

      const scaleY =
        active.scaleY ?? 1;

      setSelectedScale(
        Math.round(
          (
            (
              scaleX +
              scaleY
            ) /
            2
          ) * 100
        )
      );
    }, []);

  /* ======================================================= */
  /* SINCRONIZAR LISTA DE CAPAS */
  /* ======================================================= */

  const syncLayers =
    useCallback(() => {
      const canvas =
        fabricCanvasRef.current;

      if (!canvas) {
        return;
      }

      const objects =
        canvas.getObjects();

      let imageNumber =
        0;

      const layerItems =
        objects.map(
          (
            object,
            stackIndex
          ): LayerItem => {
            if (
              object instanceof
              Textbox
            ) {
              const rawText =
                object.text?.trim() ||
                "Texto";

              const label =
                rawText.length >
                28
                  ? `${rawText.slice(
                      0,
                      28
                    )}…`
                  : rawText;

              return {
                stackIndex,
                type: "text",
                label,
              };
            }

            imageNumber +=
              1;

            return {
              stackIndex,
              type: "image",
              label: `Imagen ${imageNumber}`,
            };
          }
        );

      /*
       * Fabric:
       * índice mayor = más al frente.
       *
       * Invertimos para que la lista
       * se lea como Photoshop/Canva:
       *
       * arriba = más al frente.
       */
      setLayers(
        [...layerItems].reverse()
      );

      const active =
        canvas.getActiveObject();

      if (!active) {
        setSelectedLayerStackIndex(
          null
        );

        return;
      }

      const activeIndex =
        objects.indexOf(
          active
        );

      setSelectedLayerStackIndex(
        activeIndex >= 0
          ? activeIndex
          : null
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

      if (
        last === json
      ) {
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

          setSelectedLayerStackIndex(
            null
          );

          setSelectedX(0);
          setSelectedY(0);
          setSelectedAngle(0);
          setSelectedScale(100);

          syncLayers();

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
        syncLayers,
        updateHistoryButtons,
      ]
    );

  /* ======================================================= */
  /* DESHACER */
  /* ======================================================= */

  const undo =
    useCallback(async () => {
      if (
        restoringHistoryRef.current ||
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

          selection:
            true,
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

        syncTransformControls();

        syncLayers();

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

          syncTextControls(
            active
          );

          return;
        }

        setSelectedType(
          "image"
        );
      };

    /* ===================================================== */
    /* EVENTOS */
    /* ===================================================== */

    const handleAdded =
      () => {
        if (
          restoringHistoryRef.current
        ) {
          return;
        }

        syncLayers();

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

        syncLayers();

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

        syncTransformControls();

        syncLayers();

        emitSnapshot();

        saveHistory();

        const active =
          canvas.getActiveObject();

        if (
          active instanceof
          Textbox
        ) {
          syncTextControls(
            active
          );
        }
      };

    const handleLiveChange =
      () => {
        if (
          restoringHistoryRef.current
        ) {
          return;
        }

        syncTransformControls();

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

    syncLayers();

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
    syncTextControls,
    syncTransformControls,
    syncLayers,
  ]);

  /* ======================================================= */
  /* HELPERS */
  /* ======================================================= */

  function getActiveObject() {
    return (
      fabricCanvasRef.current
        ?.getActiveObject() ??
      null
    );
  }

  function getActiveText() {
    const active =
      getActiveObject();

    if (
      !(
        active instanceof
        Textbox
      )
    ) {
      return null;
    }

    return active;
  }

  function finishChange() {
    const canvas =
      fabricCanvasRef.current;

    if (!canvas) {
      return;
    }

    const active =
      canvas.getActiveObject();

    active?.setCoords();

    canvas.requestRenderAll();

    syncTransformControls();

    syncLayers();

    emitSnapshot();

    saveHistory();
  }

  /* ======================================================= */
  /* SELECCIONAR CAPA DESDE LISTA */
  /* ======================================================= */

  function selectLayer(
    stackIndex: number
  ) {
    const canvas =
      fabricCanvasRef.current;

    if (!canvas) {
      return;
    }

    const objects =
      canvas.getObjects();

    const object =
      objects[
        stackIndex
      ];

    if (!object) {
      return;
    }

    canvas.discardActiveObject();

    canvas.setActiveObject(
      object
    );

    object.setCoords();

    canvas.requestRenderAll();

    setSelectedLayerStackIndex(
      stackIndex
    );

    syncTransformControls();

    if (
      object instanceof
      Textbox
    ) {
      setSelectedType(
        "text"
      );

      syncTextControls(
        object
      );
    } else {
      setSelectedType(
        "image"
      );
    }

    syncLayers();
  }

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

          fontSize:
            selectedFontSize,

          fontWeight:
            selectedBold
              ? "bold"
              : "normal",

          fontStyle:
            selectedItalic
              ? "italic"
              : "normal",

          fontFamily:
            selectedFontFamily,

          textAlign:
            selectedAlignment,

          originX:
            "left",

          originY:
            "top",

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

    syncTextControls(
      text
    );

    syncTransformControls();

    syncLayers();

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

        const width =
          image.width ||
          1;

        const height =
          image.height ||
          1;

        const scale =
          Math.min(
            190 / width,
            190 / height,
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

    syncTransformControls();

    syncLayers();

    emitSnapshot();

    if (
      fileInputRef.current
    ) {
      fileInputRef.current.value =
        "";
    }
  }

  /* ======================================================= */
  /* DUPLICAR */
  /* ======================================================= */

  async function duplicateSelected() {
    const canvas =
      fabricCanvasRef.current;

    const active =
      canvas?.getActiveObject();

    if (
      !canvas ||
      !active
    ) {
      return;
    }

    try {
      const clone =
        await active.clone();

      clone.set({
        left:
          (
            active.left ??
            0
          ) + 20,

        top:
          (
            active.top ??
            0
          ) + 20,

        evented:
          true,
      });

      canvas.add(
        clone
      );

      canvas.setActiveObject(
        clone
      );

      canvas.renderAll();

      if (
        clone instanceof
        Textbox
      ) {
        setSelectedType(
          "text"
        );

        syncTextControls(
          clone
        );
      } else {
        setSelectedType(
          "image"
        );
      }

      syncTransformControls();

      syncLayers();

      emitSnapshot();
    } catch (error) {
      console.error(
        "No fue posible duplicar el elemento:",
        error
      );
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

    const objects =
      canvas.getActiveObjects();

    if (
      objects.length ===
      0
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

    setSelectedLayerStackIndex(
      null
    );

    syncLayers();

    emitSnapshot();

    saveHistory();
  }

  /* ======================================================= */
  /* TEXTO: COLOR */
  /* ======================================================= */

  function updateTextColor(
    color: string
  ) {
    setSelectedTextColor(
      color
    );

    const text =
      getActiveText();

    if (!text) {
      return;
    }

    text.set({
      fill: color,
    });

    finishChange();
  }

  /* ======================================================= */
  /* TEXTO: FUENTE */
  /* ======================================================= */

  function updateFontFamily(
    value: string
  ) {
    setSelectedFontFamily(
      value
    );

    const text =
      getActiveText();

    if (!text) {
      return;
    }

    text.set({
      fontFamily:
        value,
    });

    finishChange();
  }

  /* ======================================================= */
  /* TEXTO: TAMAÑO */
  /* ======================================================= */

  function updateFontSize(
    value: number
  ) {
    const size =
      Math.min(
        Math.max(
          value,
          12
        ),
        120
      );

    setSelectedFontSize(
      size
    );

    const text =
      getActiveText();

    if (!text) {
      return;
    }

    text.set({
      fontSize:
        size,
    });

    finishChange();
  }

  /* ======================================================= */
  /* TEXTO: NEGRITA */
  /* ======================================================= */

  function toggleBold() {
    const next =
      !selectedBold;

    setSelectedBold(
      next
    );

    const text =
      getActiveText();

    if (!text) {
      return;
    }

    text.set({
      fontWeight:
        next
          ? "bold"
          : "normal",
    });

    finishChange();
  }

  /* ======================================================= */
  /* TEXTO: CURSIVA */
  /* ======================================================= */

  function toggleItalic() {
    const next =
      !selectedItalic;

    setSelectedItalic(
      next
    );

    const text =
      getActiveText();

    if (!text) {
      return;
    }

    text.set({
      fontStyle:
        next
          ? "italic"
          : "normal",
    });

    finishChange();
  }

  /* ======================================================= */
  /* TEXTO: ALINEACIÓN */
  /* ======================================================= */

  function updateAlignment(
    alignment: TextAlignment
  ) {
    setSelectedAlignment(
      alignment
    );

    const text =
      getActiveText();

    if (!text) {
      return;
    }

    text.set({
      textAlign:
        alignment,
    });

    finishChange();
  }

  /* ======================================================= */
  /* POSICIÓN X */
  /* ======================================================= */

  function updatePositionX(
    value: number
  ) {
    const canvas =
      fabricCanvasRef.current;

    const active =
      canvas?.getActiveObject();

    if (
      !canvas ||
      !active ||
      Number.isNaN(
        value
      )
    ) {
      return;
    }

    setSelectedX(
      value
    );

    active.set({
      left:
        value,
    });

    active.setCoords();

    canvas.requestRenderAll();

    emitSnapshot();
  }

  /* ======================================================= */
  /* POSICIÓN Y */
  /* ======================================================= */

  function updatePositionY(
    value: number
  ) {
    const canvas =
      fabricCanvasRef.current;

    const active =
      canvas?.getActiveObject();

    if (
      !canvas ||
      !active ||
      Number.isNaN(
        value
      )
    ) {
      return;
    }

    setSelectedY(
      value
    );

    active.set({
      top:
        value,
    });

    active.setCoords();

    canvas.requestRenderAll();

    emitSnapshot();
  }

  /* ======================================================= */
  /* ROTACIÓN */
  /* ======================================================= */

  function updateObjectAngle(
    value: number
  ) {
    const canvas =
      fabricCanvasRef.current;

    const active =
      canvas?.getActiveObject();

    if (
      !canvas ||
      !active
    ) {
      return;
    }

    setSelectedAngle(
      value
    );

    active.rotate(
      value
    );

    active.setCoords();

    canvas.requestRenderAll();

    emitSnapshot();
  }

  /* ======================================================= */
  /* ESCALA */
  /* ======================================================= */

  function updateObjectScale(
    value: number
  ) {
    const canvas =
      fabricCanvasRef.current;

    const active =
      canvas?.getActiveObject();

    if (
      !canvas ||
      !active
    ) {
      return;
    }

    const safe =
      Math.min(
        Math.max(
          value,
          10
        ),
        300
      );

    const scale =
      safe / 100;

    setSelectedScale(
      safe
    );

    active.set({
      scaleX:
        scale,

      scaleY:
        scale,
    });

    active.setCoords();

    canvas.requestRenderAll();

    emitSnapshot();
  }

  /* ======================================================= */
  /* GUARDAR TRANSFORMACIÓN */
  /* ======================================================= */

  function saveTransformChange() {
    finishChange();
  }

  /* ======================================================= */
  /* CENTRAR HORIZONTAL */
  /* ======================================================= */

  function centerHorizontal() {
    const canvas =
      fabricCanvasRef.current;

    const active =
      canvas?.getActiveObject();

    if (
      !canvas ||
      !active
    ) {
      return;
    }

    const bounds =
      active.getBoundingRect();

    const currentCenter =
      bounds.left +
      bounds.width /
        2;

    const desired =
      canvas.getWidth() /
      2;

    active.set({
      left:
        (
          active.left ??
          0
        ) +
        desired -
        currentCenter,
    });

    finishChange();
  }

  /* ======================================================= */
  /* CENTRAR VERTICAL */
  /* ======================================================= */

  function centerVertical() {
    const canvas =
      fabricCanvasRef.current;

    const active =
      canvas?.getActiveObject();

    if (
      !canvas ||
      !active
    ) {
      return;
    }

    const bounds =
      active.getBoundingRect();

    const currentCenter =
      bounds.top +
      bounds.height /
        2;

    const desired =
      canvas.getHeight() /
      2;

    active.set({
      top:
        (
          active.top ??
          0
        ) +
        desired -
        currentCenter,
    });

    finishChange();
  }

  /* ======================================================= */
  /* CAPAS: SUBIR */
  /* ======================================================= */

  function moveLayerUp() {
    const canvas =
      fabricCanvasRef.current;

    const active =
      canvas?.getActiveObject();

    if (
      !canvas ||
      !active
    ) {
      return;
    }

    canvas.bringObjectForward(
      active
    );

    canvas.setActiveObject(
      active
    );

    finishChange();
  }

  /* ======================================================= */
  /* CAPAS: BAJAR */
  /* ======================================================= */

  function moveLayerDown() {
    const canvas =
      fabricCanvasRef.current;

    const active =
      canvas?.getActiveObject();

    if (
      !canvas ||
      !active
    ) {
      return;
    }

    canvas.sendObjectBackwards(
      active
    );

    canvas.setActiveObject(
      active
    );

    finishChange();
  }

  /* ======================================================= */
  /* CAPAS: AL FRENTE */
  /* ======================================================= */

  function moveLayerToFront() {
    const canvas =
      fabricCanvasRef.current;

    const active =
      canvas?.getActiveObject();

    if (
      !canvas ||
      !active
    ) {
      return;
    }

    canvas.bringObjectToFront(
      active
    );

    canvas.setActiveObject(
      active
    );

    finishChange();
  }

  /* ======================================================= */
  /* CAPAS: AL FONDO */
  /* ======================================================= */

  function moveLayerToBack() {
    const canvas =
      fabricCanvasRef.current;

    const active =
      canvas?.getActiveObject();

    if (
      !canvas ||
      !active
    ) {
      return;
    }

    canvas.sendObjectToBack(
      active
    );

    canvas.setActiveObject(
      active
    );

    finishChange();
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
      objects.length ===
      0
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

    setSelectedLayerStackIndex(
      null
    );

    syncLayers();

    emitSnapshot();

    saveHistory();
  }

  /* ======================================================= */
  /* ATAJOS */
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
            "TEXTAREA" ||
          target?.tagName ===
            "SELECT"
        ) {
          return;
        }

        if (
          !event.ctrlKey &&
          !event.metaKey
        ) {
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
    <div className="w-full min-w-0 space-y-4">
      {/* ================================================= */}
      {/* HISTORIAL */}
      {/* ================================================= */}

      <div className="flex min-w-0 items-center justify-between gap-4 rounded-xl border border-white/10 bg-black p-3">
        <div className="min-w-0">
          <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-zinc-600">
            Historial
          </p>

          <p className="mt-1 truncate text-xs text-zinc-400">
            Deshacer / Rehacer
          </p>
        </div>

        <div className="flex shrink-0 gap-2">
          <button
            type="button"
            onClick={() =>
              void undo()
            }
            disabled={
              !canUndo
            }
            title="Deshacer"
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-[#111] text-xl text-white transition hover:border-red-500/50 hover:text-red-500 disabled:cursor-not-allowed disabled:opacity-20"
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
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-[#111] text-xl text-white transition hover:border-red-500/50 hover:text-red-500 disabled:cursor-not-allowed disabled:opacity-20"
          >
            ↷
          </button>
        </div>
      </div>

      {/* ================================================= */}
      {/* DISEÑO */}
      {/* ================================================= */}

      {panel ===
        "design" && (
        <div className="rounded-2xl border border-white/10 bg-[#111] p-5">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-red-500">
            Logos e imágenes
          </p>

          <p className="mt-2 text-xs leading-5 text-zinc-600">
            Sube uno o varios elementos para agregarlos a tu diseño.
          </p>

          <label
            htmlFor={
              uploadInputId
            }
            className="mt-5 flex cursor-pointer items-center justify-between gap-4 rounded-xl border border-dashed border-white/15 bg-black p-4 transition hover:border-red-500/50"
          >
            <div className="min-w-0">
              <p className="truncate text-sm font-bold text-white">
                Subir logos o imágenes
              </p>

              <p className="mt-1 text-xs text-zinc-600">
                PNG, JPG o WEBP
              </p>
            </div>

            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-600 text-xl font-bold text-white">
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
            multiple
            accept="image/png,image/jpeg,image/webp"
            onChange={
              addImages
            }
            className="hidden"
          />

          {selectedType ===
            "image" && (
            <div className="mt-5 rounded-xl border border-red-500/20 bg-red-500/5 p-4">
              <p className="text-xs font-bold text-white">
                Imagen seleccionada
              </p>

              <p className="mt-1 text-xs leading-5 text-zinc-600">
                Muévela directamente en el área de diseño o entra a Capas para realizar ajustes precisos.
              </p>
            </div>
          )}
        </div>
      )}

      {/* ================================================= */}
      {/* TEXTO */}
      {/* ================================================= */}

      {panel ===
        "text" && (
        <div className="rounded-2xl border border-white/10 bg-[#111] p-5">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-red-500">
            Texto
          </p>

          <div className="mt-4 flex min-w-0 gap-2">
            <input
              value={
                textValue
              }
              onChange={(
                event
              ) => {
                setTextValue(
                  event.target.value
                );
              }}
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
              className="min-w-0 flex-1 rounded-xl border border-white/10 bg-black px-4 py-3 text-sm text-white outline-none focus:border-red-500"
            />

            <button
              type="button"
              onClick={
                addText
              }
              className="shrink-0 rounded-xl bg-red-600 px-4 text-sm font-bold text-white transition hover:bg-red-500"
            >
              + Texto
            </button>
          </div>

          {selectedType !==
            "text" && (
            <div className="mt-5 rounded-xl border border-white/10 bg-black p-4">
              <p className="text-xs leading-5 text-zinc-500">
                Agrega un texto o selecciónalo dentro del área de diseño para mostrar sus opciones.
              </p>
            </div>
          )}

          {selectedType ===
            "text" && (
            <div className="mt-6 space-y-5 border-t border-white/10 pt-5">
              {/* TIPOGRAFÍA */}

              <div>
                <label className="text-[10px] font-bold uppercase tracking-[0.16em] text-zinc-600">
                  Tipografía
                </label>

                <select
                  value={
                    selectedFontFamily
                  }
                  onChange={(
                    event
                  ) => {
                    updateFontFamily(
                      event.target.value
                    );
                  }}
                  className="mt-2 w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-sm text-white outline-none focus:border-red-500"
                >
                  {FONT_OPTIONS.map(
                    (font) => (
                      <option
                        key={
                          font
                        }
                        value={
                          font
                        }
                      >
                        {font}
                      </option>
                    )
                  )}
                </select>
              </div>

              {/* TAMAÑO */}

              <div>
                <div className="flex items-center justify-between">
                  <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-zinc-600">
                    Tamaño
                  </p>

                  <span className="text-xs font-bold text-white">
                    {
                      selectedFontSize
                    }
                    px
                  </span>
                </div>

                <input
                  type="range"
                  min="12"
                  max="120"
                  value={
                    selectedFontSize
                  }
                  onChange={(
                    event
                  ) => {
                    updateFontSize(
                      Number(
                        event.target.value
                      )
                    );
                  }}
                  className="mt-3 w-full accent-red-600"
                />
              </div>

              {/* ESTILO */}

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={
                    toggleBold
                  }
                  className={`rounded-xl border px-3 py-3 text-xs font-bold ${
                    selectedBold
                      ? "border-red-500 bg-red-500/10 text-red-500"
                      : "border-white/10 bg-black text-white"
                  }`}
                >
                  B Negrita
                </button>

                <button
                  type="button"
                  onClick={
                    toggleItalic
                  }
                  className={`rounded-xl border px-3 py-3 text-xs font-bold italic ${
                    selectedItalic
                      ? "border-red-500 bg-red-500/10 text-red-500"
                      : "border-white/10 bg-black text-white"
                  }`}
                >
                  I Cursiva
                </button>
              </div>

              {/* ALINEACIÓN */}

              <div className="grid grid-cols-3 gap-2">
                {(
                  [
                    "left",
                    "center",
                    "right",
                  ] as TextAlignment[]
                ).map(
                  (
                    alignment
                  ) => (
                    <button
                      key={
                        alignment
                      }
                      type="button"
                      onClick={() => {
                        updateAlignment(
                          alignment
                        );
                      }}
                      className={`rounded-xl border px-2 py-3 text-xs font-bold ${
                        selectedAlignment ===
                        alignment
                          ? "border-red-500 bg-red-500/10 text-red-500"
                          : "border-white/10 bg-black text-white"
                      }`}
                    >
                      {alignment ===
                      "left"
                        ? "Izq."
                        : alignment ===
                            "center"
                          ? "Centro"
                          : "Der."}
                    </button>
                  )
                )}
              </div>

              {/* COLOR */}

              <div className="flex items-center justify-between gap-4 rounded-xl border border-white/10 bg-black p-4">
                <div>
                  <p className="text-xs font-bold text-white">
                    Color
                  </p>

                  <p className="mt-1 text-[10px] uppercase text-zinc-600">
                    {
                      selectedTextColor
                    }
                  </p>
                </div>

                <input
                  type="color"
                  value={
                    selectedTextColor
                  }
                  onChange={(
                    event
                  ) => {
                    updateTextColor(
                      event.target.value
                    );
                  }}
                  className="h-11 w-14 cursor-pointer rounded-lg bg-black"
                />
              </div>
            </div>
          )}
        </div>
      )}

      {/* ================================================= */}
      {/* CAPAS */}
      {/* ================================================= */}

      {panel ===
        "layers" && (
        <div className="space-y-4">
          {/* ============================================= */}
          {/* LISTA REAL DE CAPAS */}
          {/* ============================================= */}

          <div className="rounded-2xl border border-white/10 bg-[#111] p-5">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-red-500">
                  Capas
                </p>

                <p className="mt-1 text-xs leading-5 text-zinc-600">
                  Selecciona cualquier elemento del diseño.
                </p>
              </div>

              <span className="shrink-0 rounded-full border border-white/10 bg-black px-3 py-1 text-[10px] font-bold text-zinc-500">
                {layers.length}
              </span>
            </div>

            {layers.length ===
            0 ? (
              <div className="mt-5 rounded-xl border border-dashed border-white/10 bg-black/50 p-5 text-center">
                <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-lg text-zinc-600">
                  ◫
                </div>

                <p className="mt-3 text-xs font-bold text-zinc-400">
                  Todavía no hay capas
                </p>

                <p className="mt-1 text-[10px] leading-5 text-zinc-600">
                  Agrega texto, logos o imágenes para comenzar.
                </p>
              </div>
            ) : (
              <div className="mt-5 space-y-2">
                {layers.map(
                  (
                    layer,
                    visualIndex
                  ) => {
                    const selected =
                      selectedLayerStackIndex ===
                      layer.stackIndex;

                    return (
                      <button
                        key={`${layer.stackIndex}-${layer.type}-${layer.label}`}
                        type="button"
                        onClick={() => {
                          selectLayer(
                            layer.stackIndex
                          );
                        }}
                        className={`group flex w-full min-w-0 items-center gap-3 rounded-xl border p-3 text-left transition ${
                          selected
                            ? "border-red-500 bg-red-500/10"
                            : "border-white/10 bg-black hover:border-white/20 hover:bg-white/[0.02]"
                        }`}
                      >
                        {/* ICONO */}

                        <div
                          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border text-sm font-black ${
                            selected
                              ? "border-red-500/30 bg-red-500/10 text-red-500"
                              : "border-white/10 bg-[#111] text-zinc-500"
                          }`}
                        >
                          {layer.type ===
                          "text"
                            ? "T"
                            : "▧"}
                        </div>

                        {/* INFORMACIÓN */}

                        <div className="min-w-0 flex-1">
                          <p
                            className={`truncate text-xs font-bold ${
                              selected
                                ? "text-white"
                                : "text-zinc-300"
                            }`}
                          >
                            {
                              layer.label
                            }
                          </p>

                          <div className="mt-1 flex items-center gap-2">
                            <span className="text-[9px] font-bold uppercase tracking-[0.14em] text-zinc-600">
                              {layer.type ===
                              "text"
                                ? "Texto"
                                : "Imagen"}
                            </span>

                            <span className="h-1 w-1 rounded-full bg-zinc-800" />

                            <span className="text-[9px] text-zinc-700">
                              {visualIndex ===
                              0
                                ? "Al frente"
                                : `Capa ${
                                    layers.length -
                                    visualIndex
                                  }`}
                            </span>
                          </div>
                        </div>

                        {/* INDICADOR */}

                        <div className="shrink-0">
                          {selected ? (
                            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-red-600 text-xs font-bold text-white">
                              ✓
                            </span>
                          ) : (
                            <span className="text-lg text-zinc-700 transition group-hover:text-zinc-400">
                              ›
                            </span>
                          )}
                        </div>
                      </button>
                    );
                  }
                )}
              </div>
            )}

            <p className="mt-4 text-[10px] leading-5 text-zinc-700">
              La primera capa de la lista aparece por encima de las demás.
            </p>
          </div>

          {/* ============================================= */}
          {/* SIN SELECCIÓN */}
          {/* ============================================= */}

          {!selectedType &&
            layers.length >
              0 && (
              <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
                <p className="text-xs leading-5 text-zinc-500">
                  Selecciona una capa de la lista para editar posición, tamaño y orden.
                </p>
              </div>
            )}

          {/* ============================================= */}
          {/* AJUSTE PRECISO */}
          {/* ============================================= */}

          {selectedType && (
            <>
              <div className="rounded-2xl border border-white/10 bg-[#111] p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-red-500">
                      Ajuste preciso
                    </p>

                    <p className="mt-1 text-xs text-zinc-600">
                      {selectedType ===
                      "text"
                        ? "Texto seleccionado"
                        : "Imagen seleccionada"}
                    </p>
                  </div>

                  <span className="rounded-lg border border-white/10 bg-black px-2 py-1 text-[9px] font-bold uppercase text-zinc-500">
                    Seleccionado
                  </span>
                </div>

                {/* POSICIÓN */}

                <div className="mt-5">
                  <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-zinc-600">
                    Posición
                  </p>

                  <div className="mt-3 grid grid-cols-2 gap-3">
                    <label>
                      <span className="text-[9px] font-bold uppercase text-zinc-700">
                        X
                      </span>

                      <input
                        type="number"
                        value={
                          selectedX
                        }
                        onChange={(
                          event
                        ) => {
                          updatePositionX(
                            Number(
                              event.target.value
                            )
                          );
                        }}
                        onBlur={
                          saveTransformChange
                        }
                        className="mt-2 w-full rounded-xl border border-white/10 bg-black px-3 py-3 text-sm font-bold text-white outline-none focus:border-red-500"
                      />
                    </label>

                    <label>
                      <span className="text-[9px] font-bold uppercase text-zinc-700">
                        Y
                      </span>

                      <input
                        type="number"
                        value={
                          selectedY
                        }
                        onChange={(
                          event
                        ) => {
                          updatePositionY(
                            Number(
                              event.target.value
                            )
                          );
                        }}
                        onBlur={
                          saveTransformChange
                        }
                        className="mt-2 w-full rounded-xl border border-white/10 bg-black px-3 py-3 text-sm font-bold text-white outline-none focus:border-red-500"
                      />
                    </label>
                  </div>
                </div>

                {/* ROTACIÓN */}

                <div className="mt-5">
                  <div className="flex justify-between">
                    <span className="text-[9px] font-bold uppercase tracking-[0.16em] text-zinc-600">
                      Rotación
                    </span>

                    <span className="text-xs font-bold text-white">
                      {
                        selectedAngle
                      }
                      °
                    </span>
                  </div>

                  <input
                    type="range"
                    min="-180"
                    max="180"
                    step="1"
                    value={
                      selectedAngle
                    }
                    onChange={(
                      event
                    ) => {
                      updateObjectAngle(
                        Number(
                          event.target.value
                        )
                      );
                    }}
                    onPointerUp={
                      saveTransformChange
                    }
                    onBlur={
                      saveTransformChange
                    }
                    className="mt-3 w-full accent-red-600"
                  />
                </div>

                {/* TAMAÑO */}

                <div className="mt-5">
                  <div className="flex justify-between">
                    <span className="text-[9px] font-bold uppercase tracking-[0.16em] text-zinc-600">
                      Tamaño
                    </span>

                    <span className="text-xs font-bold text-white">
                      {
                        selectedScale
                      }
                      %
                    </span>
                  </div>

                  <input
                    type="range"
                    min="10"
                    max="300"
                    step="1"
                    value={
                      selectedScale
                    }
                    onChange={(
                      event
                    ) => {
                      updateObjectScale(
                        Number(
                          event.target.value
                        )
                      );
                    }}
                    onPointerUp={
                      saveTransformChange
                    }
                    onBlur={
                      saveTransformChange
                    }
                    className="mt-3 w-full accent-red-600"
                  />
                </div>

                {/* CENTRAR */}

                <div className="mt-5 grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={
                      centerHorizontal
                    }
                    className="rounded-xl border border-white/10 bg-black px-2 py-3 text-xs font-bold text-white transition hover:border-red-500 hover:text-red-500"
                  >
                    ↔ Horizontal
                  </button>

                  <button
                    type="button"
                    onClick={
                      centerVertical
                    }
                    className="rounded-xl border border-white/10 bg-black px-2 py-3 text-xs font-bold text-white transition hover:border-red-500 hover:text-red-500"
                  >
                    ↕ Vertical
                  </button>
                </div>
              </div>

              {/* ========================================= */}
              {/* ORDEN */}
              {/* ========================================= */}

              <div className="rounded-2xl border border-white/10 bg-[#111] p-5">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-red-500">
                  Orden de capa
                </p>

                <p className="mt-1 text-xs leading-5 text-zinc-600">
                  Decide qué elemento aparece encima de los demás.
                </p>

                <div className="mt-4 grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={
                      moveLayerUp
                    }
                    className="rounded-xl border border-white/10 bg-black px-3 py-3 text-xs font-bold text-white transition hover:border-red-500 hover:text-red-500"
                  >
                    ↑ Subir
                  </button>

                  <button
                    type="button"
                    onClick={
                      moveLayerDown
                    }
                    className="rounded-xl border border-white/10 bg-black px-3 py-3 text-xs font-bold text-white transition hover:border-red-500 hover:text-red-500"
                  >
                    ↓ Bajar
                  </button>

                  <button
                    type="button"
                    onClick={
                      moveLayerToFront
                    }
                    className="rounded-xl border border-white/10 bg-black px-3 py-3 text-xs font-bold text-white transition hover:border-red-500 hover:text-red-500"
                  >
                    ⇈ Al frente
                  </button>

                  <button
                    type="button"
                    onClick={
                      moveLayerToBack
                    }
                    className="rounded-xl border border-white/10 bg-black px-3 py-3 text-xs font-bold text-white transition hover:border-red-500 hover:text-red-500"
                  >
                    ⇊ Al fondo
                  </button>
                </div>
              </div>

              {/* ========================================= */}
              {/* ACCIONES */}
              {/* ========================================= */}

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={
                    duplicateSelected
                  }
                  className="rounded-xl border border-white/10 bg-[#111] px-3 py-4 text-xs font-bold uppercase text-white transition hover:border-white/30"
                >
                  Duplicar
                </button>

                <button
                  type="button"
                  onClick={
                    deleteSelected
                  }
                  className="rounded-xl border border-red-500/20 bg-red-500/5 px-3 py-4 text-xs font-bold uppercase text-red-500 transition hover:border-red-500"
                >
                  Eliminar
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {/* ================================================= */}
      {/* ÁREA DE DISEÑO */}
      {/* ================================================= */}

      <div>
        <div className="mb-2 flex items-center justify-between gap-4">
          <div>
            <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-zinc-600">
              Área de diseño
            </p>

            <p className="mt-1 text-xs text-zinc-500">
              {objectCount}{" "}
              {objectCount ===
              1
                ? "elemento"
                : "elementos"}
            </p>
          </div>

          <button
            type="button"
            onClick={
              clearCanvas
            }
            disabled={
              objectCount ===
              0
            }
            className="text-[10px] font-bold uppercase tracking-wider text-zinc-600 transition hover:text-red-500 disabled:cursor-not-allowed disabled:opacity-20"
          >
            Limpiar
          </button>
        </div>

        <div className="w-full min-w-0 overflow-hidden rounded-2xl border border-white/10 bg-[linear-gradient(45deg,#111_25%,transparent_25%),linear-gradient(-45deg,#111_25%,transparent_25%),linear-gradient(45deg,transparent_75%,#111_75%),linear-gradient(-45deg,transparent_75%,#111_75%)] bg-[length:24px_24px] bg-[position:0_0,0_12px,12px_-12px,-12px_0px]">
          <div className="mx-auto w-full min-w-0 max-w-[500px] overflow-x-auto overflow-y-hidden">
            <canvas
              ref={
                htmlCanvasRef
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
}